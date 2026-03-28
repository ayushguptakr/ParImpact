const variantClasses = {
  primary:
    "bg-green-500 text-white shadow-sm hover:bg-green-400 hover:shadow-md hover:ring-2 hover:ring-green-400/30 dark:bg-green-500 dark:text-[#0A0F0D]",
  secondary:
    "border border-gray-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-[#E5E7EB] dark:hover:bg-white/10",
  ghost:
    "border border-transparent bg-transparent text-neutral-600 hover:border-[var(--pi-border)] hover:bg-neutral-50/80 hover:text-neutral-900 dark:text-[#9CA3AF] dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-[#E5E7EB]",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98] ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
