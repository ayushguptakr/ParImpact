function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-[var(--pi-border)] bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 transition-[border-color,box-shadow,background-color] duration-200 ease-out focus:border-green-600/35 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.08)] focus:outline-none dark:border-white/10 dark:bg-[#0A0F0D] dark:text-[#E5E7EB] dark:placeholder:text-[#9CA3AF]/70 dark:focus:border-green-500/40 dark:focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)] ${className}`}
      {...props}
    />
  );
}

export default Input;
