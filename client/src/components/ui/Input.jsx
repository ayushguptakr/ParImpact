function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-[var(--pi-border)] bg-gray-50 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-transparent dark:border-white/10 dark:bg-white/5 dark:text-[#E5E7EB] dark:placeholder:text-[#9CA3AF]/70 ${className}`}
      {...props}
    />
  );
}

export default Input;
