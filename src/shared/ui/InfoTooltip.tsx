/** Иконка «i» с всплывающей подсказкой (по наведению). */
export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <span className="grid h-4 w-4 cursor-help place-items-center rounded-full border border-[var(--muted)] text-[10px] leading-none text-[var(--muted)]">
        i
      </span>
      <span className="neo-raised pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-max max-w-[300px] -translate-x-1/2 rounded-lg px-3 py-1.5 text-xs text-[var(--text)] opacity-0 transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  )
}
