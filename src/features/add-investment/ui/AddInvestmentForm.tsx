import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { investmentStore } from '@/entities/investment'
import { Input, Button } from '@/shared/ui'

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Форма ручного добавления вложения (дата + сумма) с валидацией Zod. */
export function AddInvestmentForm() {
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      z.object({
        date: z.string().min(1, t('investments.errors.dateRequired')),
        amount: z.coerce
          .number({ message: t('investments.errors.amountPositive') })
          .positive(t('investments.errors.amountPositive')),
      }),
    [t],
  )

  type FormValues = z.input<typeof schema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { date: todayIso(), amount: '' as unknown as number },
  })

  const onSubmit = handleSubmit((values) => {
    investmentStore.add({ date: values.date, amount: Number(values.amount) })
    reset({ date: todayIso(), amount: '' as unknown as number })
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-[var(--muted)]">{t('investments.date')}</span>
        <Input type="date" className="w-44" {...register('date')} />
        {errors.date && (
          <span className="text-xs text-[var(--danger)]">{errors.date.message}</span>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-[var(--muted)]">{t('investments.amount')}</span>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0"
          className="w-44"
          {...register('amount')}
        />
        {errors.amount && (
          <span className="text-xs text-[var(--danger)]">{errors.amount.message}</span>
        )}
      </label>

      <Button type="submit" variant="accent">
        {t('investments.add')}
      </Button>
    </form>
  )
}
