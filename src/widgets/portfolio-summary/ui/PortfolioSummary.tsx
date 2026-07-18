import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Bond } from '@/entities/bond'
import {
  getPortfolioTotal,
  getPortfolioInvested,
  getPortfolioProfit,
  getPortfolioProfitPct,
  getPortfolioDayChange,
  getPortfolioDayChangePct,
  getPortfolioReturnPct,
  getPortfolioAnnualIncome,
  getPortfolioYield,
} from '@/entities/bond'
import { Card, InfoTooltip } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import { formatMoney, formatPercent, maskMoney } from '@/shared/lib/format'
import { BalanceToggle, useBalanceHidden } from '@/features/toggle-balance'

const icons = {
  wallet: (
    <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm14 5.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" fill="currentColor" />
  ),
  trend: (
    <path d="M3 17l6-6 4 4 8-8M15 7h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  percent: (
    <>
      <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <circle cx="16.5" cy="16.5" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="8" cy="7" rx="5" ry="2.5" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <path d="M3 7v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <path d="M11 15.5c.6 1 2.5 1.8 5 1.8 2.8 0 5-1.1 5-2.5v-5" stroke="currentColor" strokeWidth="1.7" fill="none" />
    </>
  ),
}

const signClass = (n: number) => (n >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]')
const signedMoney = (n: number, hidden: boolean) =>
  hidden ? '••• ₽' : `${n > 0 ? '+' : ''}${formatMoney(n)}`
const signedPercent = (n: number) => `${n >= 0 ? '+' : ''}${formatPercent(n)}`
const arrow = (n: number) => (n >= 0 ? '▲' : '▼')

function Metric({
  icon,
  title,
  hint,
  children,
  action,
}: {
  icon: keyof typeof icons
  title: string
  hint?: ReactNode
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--muted)]">
          <span className="neo-raised-sm grid h-7 w-7 place-items-center rounded-lg text-[var(--accent)]">
            <svg width="16" height="16" viewBox="0 0 24 24">{icons[icon]}</svg>
          </span>
          <span className="text-sm">{title}</span>
          {hint}
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}

/** Сводка портфеля: стоимость, прибыль, доходность, пассивный доход. */
export function PortfolioSummary({
  bonds,
  cashRub = 0,
}: {
  bonds: Bond[]
  cashRub?: number
}) {
  const { t } = useTranslation()
  const hidden = useBalanceHidden()

  // Денежный остаток входит и в стоимость, и во «вложено» (P/L на кэш нет,
  // поэтому прибыль по бумагам не искажается).
  const value = getPortfolioTotal(bonds) + cashRub
  const invested = getPortfolioInvested(bonds) + cashRub
  const profit = getPortfolioProfit(bonds)
  const profitPct = getPortfolioProfitPct(bonds)
  const dayChange = getPortfolioDayChange(bonds)
  const dayChangePct = getPortfolioDayChangePct(bonds)
  const returnPct = getPortfolioReturnPct(bonds)
  const income = getPortfolioAnnualIncome(bonds)
  const passivePct = getPortfolioYield(bonds)

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <Metric
        icon="wallet"
        title={t('dashboard.value')}
        hint={
          cashRub > 0 ? (
            <InfoTooltip
              text={`${t('dashboard.cashBalance')}: ${maskMoney(cashRub, hidden)}`}
            />
          ) : undefined
        }
        action={<BalanceToggle />}
      >
        <p className="text-3xl font-semibold text-[var(--text-strong)]">
          {maskMoney(value, hidden)}
        </p>
        <p className="text-sm text-[var(--muted)]">
          {maskMoney(invested, hidden)} {t('dashboard.invested')}
        </p>
      </Metric>

      <Metric icon="trend" title={t('dashboard.profit')}>
        <p className="flex items-baseline gap-2">
          <span className={cn('text-3xl font-semibold', signClass(profit))}>
            {signedMoney(profit, hidden)}
          </span>
          <span className={cn('text-sm font-medium', signClass(profitPct))}>
            {arrow(profitPct)} {formatPercent(Math.abs(profitPct))}
          </span>
        </p>
        <p className={cn('text-sm', signClass(dayChange))}>
          {signedMoney(dayChange, hidden)} {arrow(dayChangePct)}{' '}
          {formatPercent(Math.abs(dayChangePct))} · {t('dashboard.perDay')}
        </p>
      </Metric>

      <Metric icon="percent" title={t('dashboard.return')}>
        <p className="text-3xl font-semibold text-[var(--text-strong)]">
          {formatPercent(returnPct)}
        </p>
        <p className={cn('text-sm', signClass(profitPct))}>
          {signedPercent(profitPct)} {t('dashboard.assetGrowth')}
        </p>
      </Metric>

      <Metric icon="coins" title={t('dashboard.passiveIncome')}>
        <p className="text-3xl font-semibold text-[var(--accent-strong)]">
          {formatPercent(passivePct)}
        </p>
        <p className="text-sm text-[var(--muted)]">
          {maskMoney(income, hidden)} {t('dashboard.perYear')}
        </p>
      </Metric>
    </div>
  )
}
