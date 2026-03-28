function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      className="pointer-events-none fixed right-4 top-20 z-[100] flex max-w-sm flex-col gap-2 md:right-6 md:top-24"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm font-medium shadow-raised-light transition-opacity duration-300 dark:shadow-none ${
            t.variant === "error"
              ? "border-rose-200/80 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-950/50 dark:text-rose-100"
              : t.variant === "info"
                ? "border-[var(--pi-border)] bg-white/95 text-neutral-900 backdrop-blur-sm dark:border-white/10 dark:bg-[#121A16]/95 dark:text-[#E5E7EB]"
                : "border-emerald-200/80 bg-emerald-50 text-emerald-900 dark:border-emerald-500/25 dark:bg-emerald-950/40 dark:text-emerald-100"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p>{t.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="shrink-0 rounded-lg px-1.5 py-0.5 text-xs opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
