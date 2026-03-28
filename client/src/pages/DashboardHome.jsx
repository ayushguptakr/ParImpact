import { useMemo, useRef, useState } from "react";
import { PartyPopper, Sparkles } from "lucide-react";
import DrawResultReveal from "../components/dashboard/DrawResultReveal";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import LogoLoader from "../components/ui/LogoLoader";
import Input from "../components/ui/Input";
import { useApp } from "../context/AppContext";
import { matchesSearch } from "../utils/filterSearch";

function DashboardHome() {
  const {
    showToast,
    user,
    subscription,
    selectedPlan,
    setSelectedPlan,
    handleSubscriptionSave,
    selectedScore,
    setSelectedScore,
    handleScoreAdd,
    scores,
    latestDraw,
    charitySelection,
    setCharitySelection,
    contributionSelection,
    setContributionSelection,
    handleCharityUpdate,
    charities,
    loading,
    searchQuery,
  } = useApp();

  const scoreSectionRef = useRef(null);
  const [courseType, setCourseType] = useState("Championship");
  const [holes, setHoles] = useState("18");
  const [scoreSaved, setScoreSaved] = useState(false);

  const usagePercent = useMemo(() => {
    if (!scores.length) return 0;
    return Math.min(100, Math.round((scores.length / 5) * 100));
  }, [scores.length]);

  const newestScoreKey = scores[0] ? `${scores[0].value}-${scores[0].date}` : "";
  const oldestScoreKey = scores[scores.length - 1]
    ? `${scores[scores.length - 1].value}-${scores[scores.length - 1].date}`
    : "";

  const displayScores = useMemo(() => {
    if (!searchQuery.trim()) return scores;
    return scores.filter((s) =>
      matchesSearch(searchQuery, [String(s.value), new Date(s.date).toLocaleDateString()])
    );
  }, [scores, searchQuery]);

  const totalImpact = useMemo(() => {
    const contribution = Number(user?.contributionPercentage || 10);
    const rounds = scores.length;
    return Math.round(rounds * 50 * (contribution / 100));
  }, [scores.length, user?.contributionPercentage]);

  const handleScoreSubmit = async () => {
    await handleScoreAdd();
    setScoreSaved(true);
    setTimeout(() => setScoreSaved(false), 850);
  };

  const selectClass =
    "w-full rounded-xl border border-[var(--pi-border)] bg-white px-3 py-2 text-sm text-neutral-900 transition-colors duration-200 focus:border-green-600/35 focus:outline-none dark:border-white/10 dark:bg-[#0A0F0D] dark:text-[#E5E7EB] dark:focus:border-green-500/40";

  if (loading && !user) {
    return <LogoLoader label="Loading your dashboard…" />;
  }

  return (
    <section id="dashboard-main" className="space-y-6 md:space-y-8">
      <div className="grid gap-6 md:gap-8 xl:grid-cols-3">
        <Card id="profile" className="scroll-mt-28">
          <div className="flex items-center justify-between">
            <Badge tone="active">{(subscription?.plan || "monthly").toUpperCase()}</Badge>
            <Badge tone={subscription?.status === "active" ? "active" : "pending"}>
              {subscription?.status || "inactive"}
            </Badge>
          </div>
          <p className="mt-4 text-5xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">$240.00</p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-[#9CA3AF]">
            Renews on{" "}
            {subscription?.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : "—"}
          </p>

          <div className="mt-4 flex gap-2">
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className={selectClass}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <Button variant="primary" onClick={handleSubscriptionSave} disabled={loading}>
              Save
            </Button>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-neutral-600 dark:text-[#9CA3AF]">
              <span>Usage Limit</span>
              <span>{usagePercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-200 dark:bg-white/10">
              <div className="h-2 rounded-full bg-[#22C55E]" style={{ width: `${usagePercent}%` }} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-[#22C55E]">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <h3 className="text-2xl font-semibold leading-[1.08] tracking-[-0.01em] text-neutral-800 dark:text-[#E5E7EB]">
              Monthly Impact Draw
            </h3>
          </div>
          <p className="mt-1 text-sm text-neutral-600 dark:text-[#9CA3AF]">
            Anticipation is building for the next reveal.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-4xl font-semibold text-neutral-800 motion-safe:animate-pulse dark:text-[#E5E7EB]">
                04
              </p>
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-[#9CA3AF]">Days</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-neutral-800 motion-safe:animate-pulse dark:text-[#E5E7EB]">
                18
              </p>
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-[#9CA3AF]">Hours</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-neutral-800 motion-safe:animate-pulse dark:text-[#E5E7EB]">
                42
              </p>
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-[#9CA3AF]">Mins</p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="mt-5 w-full"
            type="button"
            onClick={() =>
              showToast("Live prize totals will appear when the draw service is connected.", "info")
            }
          >
            View Prize Pool
          </Button>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-[#9CA3AF]">Primary Beneficiary</p>
          <h4 className="mt-2 text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">
            {user?.charity?.name || "Select a cause"}
          </h4>
          <p className="mt-5 text-5xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">
            {user?.contributionPercentage || 10}%
          </p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-[#9CA3AF]">Total contribution</p>
          {latestDraw?.drawNumbers?.length ? (
            <p className="mt-3 text-xs text-green-800 dark:text-[#22C55E]">
              Latest draw: {latestDraw.drawNumbers.join(" • ")}
            </p>
          ) : null}
        </Card>

        <Card
          id="section-impact"
          className="scroll-mt-28 border-green-600/20 shadow-soft-light dark:border-green-500/20 dark:shadow-[0_0_0_1px_rgba(34,197,94,0.1),0_18px_38px_rgba(0,0,0,0.38)]"
        >
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-green-100 p-2 text-green-800 dark:bg-green-500/15 dark:text-[#22C55E]">
              <PartyPopper className="h-4 w-4" aria-hidden />
            </span>
            <h4 className="text-xl font-semibold leading-[1.1] tracking-[-0.01em] text-neutral-800 dark:text-[#E5E7EB]">
              Impact Summary
            </h4>
          </div>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.02em] text-neutral-800 dark:text-[#E5E7EB]">
            ${totalImpact}
          </p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-[#9CA3AF]">
            Estimated total donated from your active rounds.
          </p>
          <p className="mt-4 text-sm text-green-800 dark:text-[#22C55E]">Your rounds are making a difference.</p>
        </Card>

        <Card id="charity-contribution" className="scroll-mt-28">
          <h4 className="text-xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">Charity Contribution</h4>
          <p className="mt-1 text-sm text-neutral-600 dark:text-[#9CA3AF]">Update your beneficiary and contribution ratio.</p>
          <div className="mt-4 space-y-3">
            <select
              value={charitySelection}
              onChange={(e) => setCharitySelection(e.target.value)}
              className={selectClass}
            >
              <option value="">Select charity</option>
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
              value={contributionSelection}
              onChange={(e) => setContributionSelection(e.target.value)}
            />
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleCharityUpdate}
              disabled={loading || !charitySelection}
            >
              Save Contribution
            </Button>
          </div>
        </Card>

        <Card ref={scoreSectionRef} id="score-entry" className="xl:col-span-1 scroll-mt-6">
          <h3 className="text-3xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">Enter Latest Score</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-[#9CA3AF]">Score (1-45)</p>
          <Input
            className="mt-3 text-4xl font-semibold shadow-[0_0_0_1px_rgba(34,197,94,0.15)] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.24)]"
            type="number"
            min={1}
            max={45}
            value={selectedScore || ""}
            onChange={(e) => setSelectedScore(Number(e.target.value))}
            placeholder="38"
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              className={selectClass}
            >
              <option>Championship</option>
              <option>Match Play</option>
              <option>Stroke Play</option>
            </select>
            <select value={holes} onChange={(e) => setHoles(e.target.value)} className={selectClass}>
              <option value="9">9 Holes</option>
              <option value="18">18 Holes</option>
            </select>
          </div>
          <Button
            variant="primary"
            className={`mt-4 w-full ${scoreSaved ? "scale-[1.03] shadow-[0_0_0_1px_rgba(34,197,94,0.3),0_0_24px_rgba(34,197,94,0.32)]" : ""}`}
            onClick={handleScoreSubmit}
            disabled={loading || !selectedScore}
          >
            Log Performance
          </Button>
          {scoreSaved ? (
            <p className="mt-2 text-xs text-green-800 dark:text-[#22C55E]">
              Performance saved. Every round contributes to a cause.
            </p>
          ) : null}
        </Card>

        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">Recent Performance</h3>
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Last 5 rounds (Rolling Window)</p>
            </div>
            <p className="text-xs uppercase tracking-[0.12em] text-rose-700 dark:text-rose-300">Will be replaced next</p>
          </div>

          <div className="space-y-3">
            {displayScores.map((score) => {
              const rowKey = `${score.value}-${score.date}`;
              const isNewest = rowKey === newestScoreKey;
              const isOldest = rowKey === oldestScoreKey;
              return (
                <article
                  key={rowKey}
                  className={`rounded-2xl border p-4 transition-all duration-300 ${
                    isNewest
                      ? "border-green-600/35 bg-green-50/90 dark:border-green-500/35 dark:bg-green-500/8"
                      : isOldest
                        ? "border-rose-300/80 bg-rose-50/90 dark:border-rose-500/30 dark:bg-rose-500/8"
                        : "border-neutral-200/55 bg-neutral-50/90 dark:border-white/8 dark:bg-black/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-[#E5E7EB]">
                        {new Date(score.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-[#9CA3AF]">
                        {isNewest ? "Latest highlight" : isOldest ? "Will be replaced next" : "Score entry"}
                      </p>
                    </div>
                    <p
                      className={`text-4xl font-semibold ${isNewest ? "text-green-800 dark:text-[#22C55E]" : "text-neutral-800 dark:text-[#E5E7EB]"}`}
                    >
                      {score.value}
                    </p>
                  </div>
                </article>
              );
            })}
            {!scores.length ? (
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">No recent performance data.</p>
            ) : null}
            {scores.length > 0 && !displayScores.length ? (
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">No rounds match “{searchQuery.trim()}”.</p>
            ) : null}
          </div>
        </Card>

        <div id="section-draws" className="scroll-mt-28 xl:col-span-3">
          <DrawResultReveal
            key={(latestDraw?.drawNumbers || []).join("-")}
            drawNumbers={latestDraw?.drawNumbers || []}
            matchCount={latestDraw?.matchCount || 0}
          />
        </div>
      </div>
    </section>
  );
}

export default DashboardHome;
