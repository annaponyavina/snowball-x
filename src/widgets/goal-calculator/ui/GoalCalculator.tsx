import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  loadGoal,
  saveGoal,
  toMonths,
  projectGrowth,
  summarizeGoal,
} from '@/entities/goal'
import type { GoalState } from '@/entities/goal'
import { Card, Input, Select } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import { formatMoney } from '@/shared/lib/format'
import { GrowthChart } from './GrowthChart'

const num = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0)

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-[var(--muted)]">{label}</span>
      {children}
    </label>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="neo-pressed rounded-xl px-4 py-3">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p
        className={cn(
          'mt-1 text-lg font-semibold',
          accent ? 'text-[var(--accent-strong)]' : 'text-[var(--text-strong)]',
        )}
      >
        {value}
      </p>
    </div>
  )
}

/** Калькулятор финансовой цели: форма, результаты и график роста капитала. */
export function GoalCalculator() {
  const { t } = useTranslation()
  const { register, watch } = useForm<GoalState>({ defaultValues: loadGoal() })

  const values = watch()

  // Живой пересчёт по мере ввода.
  const { points, summary, months, target } = useMemo(() => {
    const months = toMonths(num(values.termValue) || 1, values.termUnit)
    const target = num(values.target)
    const points = projectGrowth({
      monthly: num(values.monthly),
      annualRate: num(values.annualRate),
      months,
      reinvest: values.reinvest,
    })
    const summary = summarizeGoal(points, { annualRate: num(values.annualRate), target })
    return { points, summary, months, target }
  }, [values.termValue, values.termUnit, values.target, values.monthly, values.annualRate, values.reinvest])

  // Сохранение настроек в localStorage.
  useEffect(() => {
    saveGoal({
      target: num(values.target),
      monthly: num(values.monthly),
      annualRate: num(values.annualRate),
      termValue: num(values.termValue) || 1,
      termUnit: values.termUnit,
      reinvest: values.reinvest,
    })
  }, [values.target, values.monthly, values.annualRate, values.termValue, values.termUnit, values.reinvest])

  const reachText = useMemo(() => {
    if (target <= 0) return null
    if (summary.monthsToTarget === null) return { ok: false, text: t('goal.notReached') }
    const m = summary.monthsToTarget
    if (m === 0) return { ok: true, text: t('goal.reachedNow') }
    const years = Math.floor(m / 12)
    const rem = m % 12
    const parts = [
      years > 0 ? `${years} ${t('goal.yearsShort')}` : '',
      rem > 0 ? `${rem} ${t('goal.monthsShort')}` : '',
    ].filter(Boolean)
    return { ok: true, text: `${t('goal.reachedIn')} ${parts.join(' ')}` }
  }, [summary.monthsToTarget, target, t])

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-5">
        <h2 className="text-sm font-semibold text-[var(--muted)]">{t('goal.calcTitle')}</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label={t('goal.targetLabel')}>
            <Input type="number" min="0" step="1000" {...register('target', { valueAsNumber: true })} />
          </Field>
          <Field label={t('goal.monthly')}>
            <Input type="number" min="0" step="1000" {...register('monthly', { valueAsNumber: true })} />
          </Field>
          <Field label={t('goal.annualRate')}>
            <Input type="number" min="0" step="0.5" {...register('annualRate', { valueAsNumber: true })} />
          </Field>
          <Field label={t('goal.term')}>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                step="1"
                className="min-w-0 flex-1"
                {...register('termValue', { valueAsNumber: true })}
              />
              <div className="w-24 shrink-0">
                <Select {...register('termUnit')}>
                  <option value="months">{t('goal.unitMonths')}</option>
                  <option value="years">{t('goal.unitYears')}</option>
                </Select>
              </div>
            </div>
          </Field>
          <label className="relative flex cursor-pointer items-center gap-3 self-end pb-1 sm:col-span-2 lg:col-span-1">
            <input type="checkbox" className="peer sr-only" {...register('reinvest')} />
            <span className="neo-pressed block h-6 w-11 rounded-full transition-colors peer-checked:bg-[var(--accent-soft)]" />
            <span className="neo-raised-sm pointer-events-none absolute left-1 h-4 w-4 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-[var(--accent)]" />
            <span className="text-sm text-[var(--text)]">{t('goal.reinvest')}</span>
          </label>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <Card className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-[var(--muted)]">{t('goal.result')}</p>
            <p className="mt-1 text-3xl font-semibold text-[var(--text-strong)]">
              {formatMoney(summary.finalValue)}
            </p>
          </div>
          {reachText && (
            <div
              className={cn(
                'neo-pressed rounded-xl px-4 py-3 text-sm font-medium',
                reachText.ok ? 'text-[var(--success)]' : 'text-[var(--danger)]',
              )}
            >
              {reachText.text}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Stat label={t('goal.contributed')} value={formatMoney(summary.totalContributed)} />
            <Stat label={t('goal.interest')} value={formatMoney(summary.totalInterest)} accent />
            <Stat label={t('goal.passiveMonthly')} value={formatMoney(summary.monthlyPassiveIncome)} />
            <Stat label={t('goal.passiveYearly')} value={formatMoney(summary.annualPassiveIncome)} />
          </div>
        </Card>

        <Card className="flex flex-col">
          <h2 className="mb-2 text-sm font-semibold text-[var(--muted)]">
            {t('goal.chartTitle')}
          </h2>
          <GrowthChart points={points} target={target} months={months} />
        </Card>
      </div>
    </div>
  )
}
