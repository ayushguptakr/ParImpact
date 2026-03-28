import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  ChevronDown,
  HeartHandshake,
  LayoutDashboard,
  Shield,
  Trophy,
  UserRound,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import Logo, { LOGO_ALT } from "../ui/Logo";
import { useApp } from "../../context/AppContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import NavbarLayout from "./NavbarLayout";

function NavTab({ to, end, children, icon: Icon }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? "bg-green-100 text-green-900 dark:bg-green-500/10 dark:text-[#22C55E]"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-[#9CA3AF] dark:hover:bg-white/5 dark:hover:text-[#E5E7EB]"
        }`
      }
    >
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden /> : null}
      {children}
    </NavLink>
  );
}

function PrivateNavbar({ darkMode, onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useApp();
  const isAdminRoute = location.pathname === "/admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const goProfile = useCallback(() => {
    navigate("/profile");
    setMenuOpen(false);
  }, [navigate]);

  const doLogout = useCallback(() => {
    setMenuOpen(false);
    handleLogout();
  }, [handleLogout]);

  const center = (
    <>
      <NavTab to="/dashboard" end icon={LayoutDashboard}>
        Dashboard
      </NavTab>
      <NavTab to="/charity-hub" icon={HeartHandshake}>
        Impact
      </NavTab>
      <NavTab to="/live-draws" icon={Trophy}>
        Draws
      </NavTab>
      {user?.role === "admin" ? (
        <NavTab to="/admin" icon={Shield}>
          Admin
        </NavTab>
      ) : null}
    </>
  );

  const right = (
    <>
      <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--pi-border)] bg-white/60 px-3 text-sm font-medium text-neutral-800 shadow-sm transition-all duration-200 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-[#E5E7EB] dark:shadow-none dark:hover:bg-white/10"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Account menu"
        >
          <UserRound className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
          <span className="hidden max-w-[10rem] truncate sm:inline">
            {user?.name || user?.email || "Account"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
        </button>
        {menuOpen ? (
          <div
            className="surface-glass absolute right-0 top-full z-50 mt-2 min-w-[12rem] rounded-xl py-1 dark:border-white/10"
            role="menu"
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-neutral-800 transition-colors duration-200 hover:bg-neutral-100/80 dark:text-[#E5E7EB] dark:hover:bg-white/5"
              onClick={goProfile}
            >
              <UserRound className="h-4 w-4" aria-hidden />
              View Profile
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-800 transition-colors duration-200 hover:bg-rose-50/90 dark:text-rose-200 dark:hover:bg-rose-950/40"
              onClick={doLogout}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <NavbarLayout
      ariaLabel="App"
      navGapClass="gap-2"
      left={
        <button
          type="button"
          onClick={() => navigate(isAdminRoute ? "/admin" : "/dashboard")}
          aria-label={`${LOGO_ALT} — go to ${isAdminRoute ? "admin" : "dashboard"}`}
          className="flex min-w-0 items-center rounded-lg text-left outline-none transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-green-600/40 dark:focus-visible:ring-green-500/40"
        >
          <Logo variant="navbar" />
        </button>
      }
      center={center}
      right={right}
    />
  );
}

export default PrivateNavbar;
