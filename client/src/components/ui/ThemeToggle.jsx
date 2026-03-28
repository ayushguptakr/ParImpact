import { Moon, Sun } from "lucide-react";

/**
 * Sun → switch to light mode. Moon → switch to dark mode.
 */
function ThemeToggle({ darkMode, onToggle, className = "" }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Light mode" : "Dark mode"}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--pi-border)] bg-white/50 text-neutral-700 transition-all duration-200 ease-out hover:bg-neutral-50 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-[#E5E7EB] dark:hover:bg-white/10 ${className}`}
    >
      {darkMode ? (
        <Sun className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} aria-hidden />
      ) : (
        <Moon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}

export default ThemeToggle;
