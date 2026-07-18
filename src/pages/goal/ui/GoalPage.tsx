import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/shared/ui'
import { GoalCalculator } from '@/widgets/goal-calculator'

/** Экран 4 — Калькулятор финансовой цели. */
export function GoalPage() {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader title={t('nav.goal')} subtitle={t('goal.targetTitle')} />
      <GoalCalculator />
    </>
  )
}
