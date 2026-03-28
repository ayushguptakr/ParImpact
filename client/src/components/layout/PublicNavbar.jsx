import { HeartHandshake } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import Button from "../ui/Button";
import Logo, { LOGO_ALT } from "../ui/Logo";
import NavbarLayout from "./NavbarLayout";

/**
 * Marketing-site navigation — shown only when logged out.
 */
function PublicNavbar({
  darkMode,
  onToggleTheme,
  onLogin,
  onRegister,
  onNavigateToHowItWorks,
  onNavigateToImpact,
}) {
  const right = (
    <>
      <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
      <Button type="button" variant="ghost" className="px-3 py-2 text-sm" onClick={onLogin}>
        Login
      </Button>
      <Button type="button" variant="primary" className="px-4 py-2 text-sm" onClick={onRegister}>
        Register
      </Button>
    </>
  );

  const center = (
    <>
      <button
        type="button"
        onClick={onNavigateToHowItWorks}
        className="rounded-xl px-4 py-2 text-sm text-neutral-600 transition-colors duration-200 hover:text-neutral-900 dark:text-[#9CA3AF] dark:hover:text-[#E5E7EB]"
      >
        How it works
      </button>
      <button
        type="button"
        onClick={onNavigateToImpact}
        className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm text-neutral-600 transition-colors duration-200 hover:text-neutral-900 dark:text-[#9CA3AF] dark:hover:text-[#E5E7EB]"
      >
        <HeartHandshake className="h-3.5 w-3.5" aria-hidden />
        Impact
      </button>
    </>
  );

  return (
    <NavbarLayout
      ariaLabel="Marketing"
      navGapClass="gap-8 md:gap-10"
      left={
        <div className="flex min-w-0 items-center" aria-label={LOGO_ALT}>
          <Logo variant="navbar" />
        </div>
      }
      center={center}
      right={right}
    />
  );
}

export default PublicNavbar;
