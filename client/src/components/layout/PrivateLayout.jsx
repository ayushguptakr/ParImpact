import { useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, Flag, HeartHandshake, LayoutDashboard, Search, Trophy } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Logo from "../ui/Logo";
import { useApp } from "../../context/AppContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import { MOCK_NOTIFICATIONS } from "../../data/mockAppData";

const sidebarLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/live-draws", label: "Live Draws", icon: Trophy },
  { to: "/my-rounds", label: "My Rounds", icon: Flag },
  { to: "/charity-hub", label: "Charity Hub", icon: HeartHandshake },
];

function linkClass(isActive) {
  return `flex w-full min-w-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200 ${
    isActive
      ? "bg-green-100 text-green-900 shadow-[inset_0_0_0_1px_rgba(22,163,74,0.2)] dark:bg-green-500/15 dark:text-green-400 dark:shadow-[inset_0_0_0_1px_rgba(74,222,128,0.25)]"
      : "text-neutral-600 hover:bg-gray-100 hover:text-neutral-900 dark:text-[#9CA3AF] dark:hover:bg-white/5 dark:hover:text-[#E5E7EB]"
  }`;
}

function PrivateLayout() {
  const { searchQuery, setSearchQuery, subscription } = useApp();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const isSubscribed = Boolean(subscription && subscription.status === "active");
  useClickOutside(notifRef, () => setNotifOpen(false), notifOpen);

  const goToScore = () => {
    navigate("/dashboard");
    window.setTimeout(() => {
      document.getElementById("score-entry")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  return (
    <div className="grid gap-6 md:gap-8 lg:grid-cols-[230px_1fr]">
      <aside className="hidden rounded-2xl bg-white p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 dark:bg-[#07110D] dark:border-white/10 lg:block">
        <div className="mb-5 flex flex-col items-center gap-2 border-b border-gray-200 pb-4 dark:border-white/10">
          <Logo variant="sidebar" />
          <p className={`text-center text-[10px] font-medium uppercase tracking-[0.14em] ${isSubscribed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {isSubscribed ? "Premium Tier" : "No Active Membership"}
          </p>
          {!isSubscribed && (
            <button
              onClick={() => navigate('/profile')}
              className="mt-1 rounded-lg border border-green-500/20 bg-green-50/50 px-3 py-1 text-[11px] font-semibold text-green-700 transition-colors duration-200 hover:border-green-400/50 hover:bg-green-100 dark:border-green-500/10 dark:bg-green-500/5 dark:text-green-400 dark:hover:border-green-400/30 dark:hover:bg-green-500/10"
            >
              Upgrade to Premium
            </button>
          )}
        </div>

        <nav className="space-y-1.5" aria-label="Main navigation">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => linkClass(isActive)}>
                <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-[var(--pi-border)] pt-4 dark:border-white/[0.06]">
          <Button variant="primary" className="w-full" type="button" onClick={goToScore}>
            Enter Score
          </Button>
        </div>
      </aside>

      <div className="min-w-0 space-y-4 md:space-y-6">
        <nav
          className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-md border border-gray-100 dark:border-white/10 dark:bg-[#07110D] lg:hidden"
          aria-label="Main navigation mobile"
        >
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-green-100 text-green-900 dark:bg-green-500/15 dark:text-green-400"
                      : "text-neutral-600 dark:text-[#9CA3AF]"
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-3 shadow-md border border-gray-100 dark:bg-[#121A16] dark:border-white/10 sm:flex-row sm:items-center sm:justify-between md:px-5 md:py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-[#9CA3AF]">
            Quick search
          </p>
          <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
            <div className="relative min-w-0 flex-1 sm:min-w-56">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-[#9CA3AF]"
                aria-hidden
              />
              <Input
                placeholder="Search rounds, draws, charities…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pl-9"
                aria-label="Search workspace"
              />
            </div>
            <div className="relative shrink-0" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="rounded-xl border border-[var(--pi-border)] bg-white/50 p-2 text-neutral-800 transition-all duration-200 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-[#E5E7EB] dark:hover:bg-white/10"
                aria-expanded={notifOpen}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              {notifOpen ? (
                <div
                  className="surface-glass absolute right-0 top-full z-40 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl p-4"
                  role="dialog"
                  aria-label="Notification list"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-[#9CA3AF]">
                    Notifications
                  </p>
                  <ul className="max-h-72 space-y-2 overflow-y-auto">
                    {MOCK_NOTIFICATIONS.map((n) => (
                      <li
                        key={n.id}
                        className="rounded-xl border border-[var(--pi-border)] bg-white/50 px-3 py-2.5 dark:border-white/5 dark:bg-white/5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-neutral-900 dark:text-[#E5E7EB]">{n.title}</p>
                          {n.unread ? (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-[#22C55E]" aria-label="Unread" />
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-xs text-neutral-600 dark:text-[#9CA3AF]">{n.body}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-neutral-400 dark:text-[#6B7280]">
                          {n.time}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default PrivateLayout;
