import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import type { Bond } from '@/entities/bond'
import {
  getBondValue,
  getBondInvested,
  getBondProfit,
  getBondProfitPct,
  getBondShare,
  getPortfolioTotal,
} from '@/entities/bond'
import { Card } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import { formatMoney, formatNumber, formatPercent, maskMoney } from '@/shared/lib/format'
import { useBalanceHidden } from '@/features/toggle-balance'

const columnHelper = createColumnHelper<Bond>()
const signClass = (n: number) => (n >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]')

interface Props {
  bonds: Bond[]
  colorMap: Map<string, string>
}

/** Таблица активов: название, стоимость/вложено, доход, доля. */
export function AssetsTable({ bonds, colorMap }: Props) {
  const { t } = useTranslation()
  const hidden = useBalanceHidden()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'share', desc: true }])
  const total = getPortfolioTotal(bonds)

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('dashboard.cols.name'),
        enableSorting: false,
        cell: (info) => {
          const bond = info.row.original
          return (
            <div className="flex items-center gap-3">
              <span
                className="h-9 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: colorMap.get(bond.id) }}
              />
              <span className="neo-pressed grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[10px] font-bold text-[var(--text-strong)]">
                {bond.short}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium text-[var(--text-strong)]">{bond.name}</span>
                <span className="text-xs text-[var(--muted)]">
                  {bond.ticker} · {formatNumber(bond.quantity)} {t('dashboard.cols.unit')}
                </span>
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor((row) => getBondValue(row), {
        id: 'value',
        header: t('dashboard.cols.valueInvested'),
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-[var(--text-strong)]">
              {maskMoney(info.getValue(), hidden, info.row.original.currency)}
            </span>
            <span className="text-xs text-[var(--muted)]">
              {maskMoney(getBondInvested(info.row.original), hidden, info.row.original.currency)}
            </span>
          </div>
        ),
        meta: { align: 'right' as const },
      }),
      columnHelper.accessor((row) => getBondProfit(row), {
        id: 'income',
        header: t('dashboard.cols.income'),
        cell: (info) => {
          const profit = info.getValue()
          const pct = getBondProfitPct(info.row.original)
          return (
            <div className={cn('flex flex-col', signClass(profit))}>
              <span className="font-medium">
                {hidden ? '••• ₽' : `${profit > 0 ? '+' : ''}${formatMoney(profit)}`}
              </span>
              <span className="text-xs">
                {pct >= 0 ? '▲' : '▼'} {formatPercent(Math.abs(pct))}
              </span>
            </div>
          )
        },
        meta: { align: 'right' as const },
      }),
      columnHelper.accessor((row) => getBondShare(row, total), {
        id: 'share',
        header: t('dashboard.cols.share'),
        cell: (info) => (
          <span className="font-medium text-[var(--text)]">
            {formatPercent(info.getValue(), 2)}
          </span>
        ),
        meta: { align: 'right' as const },
      }),
    ],
    [t, hidden, total, colorMap],
  )

  const table = useReactTable({
    data: bonds,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const align = (header.column.columnDef.meta as { align?: string } | undefined)?.align
                  const sorted = header.column.getIsSorted()
                  const canSort = header.column.getCanSort()
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        'px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]',
                        align === 'right' ? 'text-right' : 'text-left',
                        canSort && 'cursor-pointer select-none',
                      )}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sorted === 'asc' ? ' ↑' : sorted === 'desc' ? ' ↓' : ''}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-[var(--neo-dark)]/30">
                {row.getVisibleCells().map((cell) => {
                  const align = (cell.column.columnDef.meta as { align?: string } | undefined)?.align
                  return (
                    <td
                      key={cell.id}
                      className={cn('px-5 py-4', align === 'right' ? 'text-right' : 'text-left')}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
