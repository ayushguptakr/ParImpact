import { useEffect, useMemo, useState } from "react";
import { HeartHandshake, Target, TrendingUp, Users } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { scrollToSection } from "../utils/scrollLanding";

const stats = [
  { label: "Total donated", value: "$2.4M", icon: TrendingUp },
  { label: "Active members", value: "12k+", icon: Users },
  { label: "Charity partners", value: "45", icon: HeartHandshake },
];

const impactStats = [
  { label: "Donations", value: 1480, icon: HeartHandshake },
  { label: "Programs", value: 27, icon: Target },
];

function AnimatedValue({ value }) {
  const [display, setDisplay] = useState(0);

  const { target, prefix, suffix } = useMemo(() => {
    const clean = String(value).trim();
    const hasDollar = clean.startsWith("$");
    const hasK = clean.toLowerCase().endsWith("k+");
    const hasM = clean.toLowerCase().endsWith("m");
    const numeric = parseFloat(clean.replace(/[^0-9.]/g, "")) || 0;
    const multiplier = hasM ? 1000000 : hasK ? 1000 : 1;
    const parsedTarget = numeric * multiplier;
    return {
      target: parsedTarget,
      prefix: hasDollar ? "$" : "",
      suffix: hasM ? "M" : hasK ? "k+" : "",
    };
  }, [value]);

  useEffect(() => {
    let frame;
    const duration = 900;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      setDisplay(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  if (suffix === "M") {
    return `${prefix}${(display / 1000000).toFixed(1)}M`;
  }
  if (suffix === "k+") {
    return `${Math.round(display / 1000)}k+`;
  }
  return `${prefix}${display.toLocaleString()}`;
}

function LandingPage({
  mode,
  setMode,
  authForm,
  setAuthForm,
  charities,
  loading,
  handleAuthSubmit,
}) {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="grid gap-8 md:gap-10 lg:grid-cols-[1.3fr_0.9fr]">
        <div
          id="how-it-works"
          className={`bg-white dark:bg-[#121A16] relative scroll-mt-24 overflow-hidden rounded-3xl border border-gray-100 dark:border-white/10 p-8 shadow-md transition-all duration-500 ease-in-out md:p-8 md:scroll-mt-28 hover:shadow-lg ${
            heroVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,197,94,0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(34,197,94,0.25),transparent_60%)] blur-md" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.03] dark:to-transparent" />
          <div className="relative z-10 space-y-6 md:space-y-8">
          <Badge tone="active">Live Charity Draw Active</Badge>
          <div className="max-w-3xl space-y-4">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.02em] text-neutral-900 md:text-5xl dark:text-[#E5E7EB]">
              Elevate Your <span className="text-green-700 dark:text-[#22C55E]">Game</span>, Power Your Impact.
            </h2>
            <p className="text-base text-gray-600/90 dark:text-gray-400/90 md:text-lg">
              A membership built for golfers who want performance data and purposeful giving—without
              noise or gimmicks.
            </p>
            <p className="text-sm font-medium text-green-800 dark:text-[#22C55E]">Your play is funding real change.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              className="px-6 py-3 text-base"
              type="button"
              onClick={() => {
                setMode("register");
                scrollToSection("auth-panel");
              }}
            >
              Join the Draw
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setMode("login");
                scrollToSection("auth-panel");
              }}
            >
              Member Login
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {stats.map((item) => {
              const StatIcon = item.icon;
              return (
                <Card
                  key={item.label}
                  className="p-5 md:p-6"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-lg border border-neutral-200/55 bg-neutral-50/90 p-2 text-green-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#22C55E]">
                      <StatIcon className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <p className="text-3xl font-semibold tracking-[-0.01em] text-green-800 dark:text-[#22C55E]">
                    <AnimatedValue value={item.value} />
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-gray-400">{item.label}</p>
                </Card>
              );
            })}
          </div>
          </div>
        </div>

        <Card id="auth-panel" className="self-start scroll-mt-24 md:scroll-mt-28">
          <div className="mb-5">
            <h3 className="text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">
              {mode === "register" ? "Create Your Account" : "Member Login"}
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-gray-400">
              {mode === "register"
                ? "Start your journey toward high-impact play."
                : "Welcome back to your impact command center."}
            </p>
          </div>

          <div className="mb-4 flex gap-2">
            <Button
              variant={mode === "register" ? "primary" : "secondary"}
              className="flex-1"
              onClick={() => setMode("register")}
            >
              Register
            </Button>
            <Button
              variant={mode === "login" ? "primary" : "secondary"}
              className="flex-1"
              onClick={() => setMode("login")}
            >
              Login
            </Button>
          </div>

          <form className="grid gap-3" onSubmit={handleAuthSubmit}>
            {mode === "register" ? (
              <Input
                placeholder="Full name"
                value={authForm.name}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            ) : null}

            <Input
              type="email"
              placeholder="Email address"
              value={authForm.email}
              onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />

            {mode === "register" ? (
              <>
                <select
                  className="w-full rounded-xl border border-[var(--pi-border)] bg-white px-3 py-2.5 text-sm text-neutral-900 transition-colors duration-200 focus:border-green-600/35 focus:outline-none dark:border-white/10 dark:bg-[#0A0F0D] dark:text-[#E5E7EB] dark:focus:border-green-500/40"
                  value={authForm.charityId}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, charityId: e.target.value }))}
                  required
                >
                  <option value="">Charity selection</option>
                  {charities.map((charity) => (
                    <option key={charity._id} value={charity._id}>
                      {charity.name}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min={10}
                  max={100}
                  placeholder="Contribution %"
                  value={authForm.contributionPercentage}
                  onChange={(e) =>
                    setAuthForm((prev) => ({ ...prev, contributionPercentage: e.target.value }))
                  }
                  required
                />
              </>
            ) : null}

            <Button type="submit" variant="primary" disabled={loading} className="mt-2">
              {mode === "register" ? "Initialize Impact Membership" : "Continue to Dashboard"}
            </Button>
          </form>
        </Card>
      </section>

      <section id="impact" className="scroll-mt-24 grid gap-4 md:grid-cols-2 md:gap-6 md:scroll-mt-28">
        <Card className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-gray-400">This Month Your Play Funded</p>
          <div className="mt-4 grid gap-3">
            {impactStats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-[var(--pi-border)] bg-white/60 px-4 py-3 transition-all duration-200 ease-out hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-green-100 p-2 text-green-800 dark:bg-green-500/15 dark:text-[#22C55E]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <p className="text-sm text-neutral-800 dark:text-[#E5E7EB]">{item.label}</p>
                  </div>
                  <p className="text-xl font-semibold tracking-[-0.01em] text-green-800 dark:text-[#22C55E]">{item.value}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-neutral-600 dark:text-gray-400">Every round contributes to a cause.</p>
        </Card>

        <Card className="flex items-center justify-between gap-4 p-6 md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-gray-400">Ready To Join</p>
            <h3 className="mt-2 text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-neutral-800 dark:text-[#E5E7EB]">
              Start playing with purpose.
            </h3>
          </div>
          <Button
            variant="primary"
            className="px-6 py-3 text-base"
            onClick={() => {
              setMode("register");
              scrollToSection("auth-panel");
            }}
          >
            Join Now
          </Button>
        </Card>
      </section>

      <Card id="draw-engine" className="relative scroll-mt-24 overflow-hidden md:p-8 md:scroll-mt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <h3 className="text-3xl font-semibold text-neutral-900 md:text-4xl dark:text-[#E5E7EB]">Aerospace Precision. Human Impact.</h3>
          <p className="text-neutral-600 dark:text-gray-400">
            Clear metrics, fair draws, and transparent charity routing—so you always know what moved
            the needle.
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={() => scrollToSection("draw-engine")}
          >
            How the draw engine works
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default LandingPage;
