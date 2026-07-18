import type { Bond, CouponPayment, PaymentType } from '../types'

/*
  Горизонт демо-данных — 12 месяцев «год вперёд», начиная с июля 2026.
  Даты выплат генерируются относительно этой базы, поэтому статусы
  (выплачено/объявлено/прогноз) складываются естественно от текущей даты.
*/
const BASE_YEAR = 2026
const BASE_MONTH = 7 // июль (1-indexed)

const pad = (n: number) => String(n).padStart(2, '0')

/** ISO-дата на `monthOffset` месяцев вперёд от базы (0 = июль 2026). */
function isoDate(monthOffset: number, day: number): string {
  const zeroIdx = BASE_MONTH - 1 + monthOffset
  const year = BASE_YEAR + Math.floor(zeroIdx / 12)
  const month = (zeroIdx % 12) + 1
  return `${year}-${pad(month)}-${pad(day)}`
}

interface ScheduleOpts {
  day: number
  perUnit: number
  /** Шаг в месяцах: 1 — ежемесячно, 3 — квартально, 6 — раз в полгода. */
  step: number
  count: number
  startOffset?: number
  type?: PaymentType
}

/** Построить регулярное расписание выплат на одну бумагу. */
function schedule({
  day,
  perUnit,
  step,
  count,
  startOffset = 0,
  type,
}: ScheduleOpts): CouponPayment[] {
  return Array.from({ length: count }, (_, i) => ({
    date: isoDate(startOffset + i * step, day),
    amountPerUnit: perUnit,
    ...(type ? { type } : {}),
  }))
}

/** Демонстрационный портфель облигаций (кнопка «Загрузить пример»). */
export const MOCK_BONDS: Bond[] = [
  {
    id: 'whoosh-001p-02',
    name: 'ВУШ БО 001Р-02',
    short: 'ВУШ',
    ticker: 'RU000A106HB4',
    currency: 'RUB',
    quantity: 60,
    price: 985,
    purchasePrice: 970,
    previousPrice: 987,
    faceValue: 1000,
    couponYield: 12.06,
    coupons: [
      ...schedule({ day: 2, perUnit: 9.9, step: 1, count: 12 }),
      { date: isoDate(0, 2), amountPerUnit: 200, type: 'amortization' },
    ],
  },
  {
    id: 'segezha-003p',
    name: 'ГК Сегежа 003P',
    short: 'ГКС',
    ticker: 'RU000A104UA9',
    currency: 'RUB',
    quantity: 40,
    price: 720,
    purchasePrice: 745,
    previousPrice: 722,
    faceValue: 1000,
    couponYield: 15.0,
    coupons: schedule({ day: 4, perUnit: 27, step: 3, count: 4 }),
  },
  {
    id: 'lsr-bo',
    name: 'Группа ЛСР БО 001Р-09',
    short: 'ГРУ',
    ticker: 'RU000A106888',
    currency: 'RUB',
    quantity: 30,
    price: 940,
    purchasePrice: 915,
    previousPrice: 938,
    faceValue: 1000,
    couponYield: 11.74,
    coupons: schedule({ day: 10, perUnit: 9.2, step: 1, count: 12 }),
  },
  {
    id: 'brusnika-002p',
    name: 'Брусника 002Р-02',
    short: 'БРУ',
    ticker: 'RU000A107UU5',
    currency: 'RUB',
    quantity: 50,
    price: 1005,
    purchasePrice: 990,
    previousPrice: 1002,
    faceValue: 1000,
    couponYield: 13.61,
    coupons: schedule({ day: 12, perUnit: 11.4, step: 1, count: 12 }),
  },
  {
    id: 'afk-sistema',
    name: 'АФК Система БО 001Р',
    short: 'АФК',
    ticker: 'RU000A0JVUK8',
    currency: 'RUB',
    quantity: 45,
    price: 930,
    purchasePrice: 942,
    previousPrice: 931,
    faceValue: 1000,
    couponYield: 11.48,
    coupons: schedule({ day: 13, perUnit: 8.9, step: 1, count: 12 }),
  },
  {
    id: 'rzd-001p-05',
    name: 'РЖД БО 001Р-05',
    short: 'РЖД',
    ticker: 'RU000A0ZYG52',
    currency: 'RUB',
    quantity: 25,
    price: 1012,
    purchasePrice: 1000,
    previousPrice: 1010,
    faceValue: 1000,
    couponYield: 9.49,
    coupons: schedule({ day: 24, perUnit: 48, step: 6, count: 2 }),
  },
  {
    id: 'electro',
    name: 'ЭЛЕКТРОРЕШЕНИЯ 001Р',
    short: 'ЭЛЕ',
    ticker: 'RU000A105EX7',
    currency: 'RUB',
    quantity: 35,
    price: 998,
    purchasePrice: 985,
    previousPrice: 999,
    faceValue: 1000,
    couponYield: 12.14,
    coupons: schedule({ day: 25, perUnit: 10.1, step: 1, count: 12 }),
  },
  {
    id: 'ofz-26240',
    name: 'ОФЗ 26240',
    short: 'ОФЗ',
    ticker: 'SU26240',
    currency: 'RUB',
    quantity: 50,
    price: 785,
    purchasePrice: 808,
    previousPrice: 786,
    faceValue: 1000,
    couponYield: 8.92,
    coupons: schedule({ day: 15, perUnit: 35, step: 6, count: 2, startOffset: 1 }),
  },
  {
    id: 'gazprom-capital',
    name: 'Газпром капитал',
    short: 'ГПБ',
    ticker: 'RU000A0GAZP',
    currency: 'RUB',
    quantity: 20,
    price: 968,
    purchasePrice: 958,
    previousPrice: 969,
    faceValue: 1000,
    couponYield: 8.68,
    coupons: schedule({ day: 18, perUnit: 42, step: 6, count: 2, startOffset: 2 }),
  },
  {
    id: 'samolet-bo',
    name: 'ГК Самолёт БО-П12',
    short: 'СМЛ',
    ticker: 'RU000A104YT6',
    currency: 'RUB',
    quantity: 30,
    price: 905,
    purchasePrice: 921,
    previousPrice: 907,
    faceValue: 1000,
    couponYield: 11.49,
    coupons: [
      ...schedule({ day: 5, perUnit: 26, step: 3, count: 4 }),
      { date: isoDate(4, 5), amountPerUnit: 150, type: 'amortization' },
    ],
  },
]
