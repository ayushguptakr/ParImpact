const badgeStyles = {
  active:
    "bg-green-100 text-green-800 border border-green-200/90 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30",
  pending:
    "bg-amber-50 text-amber-900 border border-amber-200/90 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  rejected:
    "bg-rose-50 text-rose-800 border border-rose-200/90 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
  muted:
    "bg-neutral-100/80 text-neutral-600 border border-neutral-200/55 dark:bg-white/5 dark:text-[#9CA3AF] dark:border-white/10",
};

function Badge({ children, tone = "muted", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${badgeStyles[tone] || badgeStyles.muted} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
