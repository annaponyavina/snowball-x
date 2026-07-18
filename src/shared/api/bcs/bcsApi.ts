import { BCS_BASE_URL } from '@/shared/config/env'
import type { PortfolioApi } from '../contract'
import type { Bond, Currency, PortfolioSnapshot } from '../types'
import { getAccessToken } from './auth'
import { buildCouponSchedule, fetchInstruments, getMaturityIso } from './instruments'
import type { BcsInstrument, BcsPosition } from './types'

const PORTFOLIO_URL = `${BCS_BASE_URL}/trade-api-bff-portfolio/api/v1/portfolio`

/** Короткий бейдж эмитента: первые буквы первого слова названия. */
function makeShort(name: string): string {
  const first = name.replace(/[«»"]/g, '').trim().split(/\s+/)[0] ?? name
  const letters = first.replace(/[^A-Za-zА-Яа-я]/g, '')
  return (letters || first).slice(0, 3).toUpperCase()
}

function toCurrency(code: string): Currency {
  return code === 'USD' ? 'USD' : 'RUB'
}

/**
 * Облигацией считаем депозитарную позицию с номиналом (faceValue > 0):
 * это отсекает деньги (moneyLimit), фьючерсы и акции (у них номинала нет).
 */
function isBond(p: BcsPosition): boolean {
  return p.type === 'depoLimit' && p.faceValue > 0 && p.quantity > 0
}

/**
 * Убрать дубли-строки одной и той же позиции. Сервис «Портфель» может вернуть
 * одну позицию несколько раз с одинаковыми субсчётом/счётом/тикером — оставляем
 * по одной такой строке, иначе стоимость и количество задваиваются.
 */
function dedupePositions(positions: BcsPosition[]): BcsPosition[] {
  const seen = new Map<string, BcsPosition>()
  for (const p of positions) {
    const key = `${p.subAccountId}|${p.account}|${p.ticker}`
    if (!seen.has(key)) seen.set(key, p)
  }
  return [...seen.values()]
}

/**
 * Свести позиции одной бумаги (одинаковый тикер на разных субсчетах) в один Bond.
 * Используем готовые рублёвые суммы из API (облигации котируются в % от номинала,
 * поэтому qty × price напрямую считать нельзя).
 */
function mergeToBond(group: BcsPosition[]): Bond {
  const first = group[0]
  const quantity = group.reduce((s, p) => s + p.quantity, 0)
  const currentValue = group.reduce((s, p) => s + p.currentValueRub, 0)
  const investedValue = group.reduce((s, p) => s + p.balanceValueRub, 0)
  const dailyTotal = group.reduce((s, p) => s + p.dailyPL, 0)

  // Приводим рублёвые суммы к «цене за штуку», чтобы совпасть с моделью Bond.
  const price = quantity > 0 ? currentValue / quantity : 0
  const purchasePrice = quantity > 0 ? investedValue / quantity : price
  const previousPrice = quantity > 0 ? (currentValue - dailyTotal) / quantity : price

  return {
    id: first.ticker,
    name: first.displayName || first.ticker,
    short: makeShort(first.displayName || first.ticker),
    ticker: first.ticker,
    currency: toCurrency(first.currency),
    quantity,
    price,
    purchasePrice,
    previousPrice,
    faceValue: first.faceValue,
    // Купонную доходность и график выплат сервис «Портфель» не отдаёт —
    // потребуется отдельный эндпоинт «Справочник»/облигации. Пока пусто.
    couponYield: 0,
    coupons: [],
  }
}

/** Группировка облигаций по тикеру и сведение каждой группы в Bond. */
function groupBonds(positions: BcsPosition[]): Bond[] {
  const byTicker = new Map<string, BcsPosition[]>()
  for (const p of positions) {
    const group = byTicker.get(p.ticker)
    if (group) group.push(p)
    else byTicker.set(p.ticker, [p])
  }
  return [...byTicker.values()].map(mergeToBond)
}

/** Свободный рублёвый остаток: денежные позиции (moneyLimit) в рублях. */
function getCashRub(positions: BcsPosition[]): number {
  return positions
    .filter((p) => p.type === 'moneyLimit' && p.currency === 'RUB')
    .reduce((s, p) => s + p.currentValueRub, 0)
}

/**
 * Дополнить облигации графиком купонов и датой погашения/оферты из справочника
 * (by-tickers). Сервис «Портфель» купоны не отдаёт, поэтому тянем их отдельно.
 * Best-effort: если справочник недоступен, портфель отдаём без купонов.
 */
async function enrichWithCoupons(bonds: Bond[]): Promise<Bond[]> {
  if (bonds.length === 0) return bonds
  let instruments: BcsInstrument[]
  try {
    instruments = await fetchInstruments(bonds.map((b) => b.ticker))
  } catch {
    return bonds
  }
  const byTicker = new Map(instruments.map((i) => [i.ticker, i]))

  return bonds.map((bond) => {
    const info = byTicker.get(bond.ticker)
    if (!info) return bond
    const coupons = buildCouponSchedule(info)
    // Годовая купонная доходность к текущей цене (annual perUnit / price).
    const annualPerUnit = coupons.reduce((s, c) => s + c.amountPerUnit, 0)
    const couponYield = bond.price > 0 ? (annualPerUnit / bond.price) * 100 : 0
    return {
      ...bond,
      coupons,
      couponYield,
      couponRate: info.couponRate,
      couponType: info.couponTypeName,
      maturityDate: getMaturityIso(info),
    }
  })
}

/**
 * Провайдер данных портфеля из БКС Торгового API.
 * Авторизация — refresh→access (см. auth.ts), запрос портфеля с Bearer-токеном.
 * В браузере ходит через dev-proxy `/bcs` (см. vite.config.ts) во избежание CORS.
 */
export const bcsApi: PortfolioApi = {
  async getPortfolio(): Promise<PortfolioSnapshot> {
    const token = await getAccessToken()
    const res = await fetch(PORTFOLIO_URL, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      throw new Error(`BCS: не удалось получить портфель (${res.status})`)
    }
    const positions = (await res.json()) as BcsPosition[]
    const deduped = dedupePositions(positions)
    const bonds = await enrichWithCoupons(groupBonds(deduped.filter(isBond)))
    return {
      bonds,
      cashRub: getCashRub(deduped),
    }
  },
}
