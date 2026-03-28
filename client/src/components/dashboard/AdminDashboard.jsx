import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Gavel, LineChart, Trophy, Users } from "lucide-react";
import { api, getAssetUrl } from "../../lib/api";
import { AdminDashboardSkeleton } from "./DashboardSkeleton";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Input from "../ui/Input";

const panelClass =
  "border border-neutral-200/55 bg-surface-raised text-neutral-800 shadow-soft-light dark:border-white/10 dark:bg-white/5 dark:text-[#E5E7EB] dark:shadow-none";
const mutedClass = "text-neutral-600 dark:text-[#9CA3AF]";
const labelClass = "text-neutral-800 dark:text-[#E5E7EB]";
const sublabelClass = "text-neutral-500 dark:text-[#6B7280]";

function AdminDashboard({ token, onError, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [charities, setCharities] = useState([]);
  const [claims, setClaims] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [poolAmount, setPoolAmount] = useState("");
  const [drawNumbers, setDrawNumbers] = useState("");
  const [drawMonthKey, setDrawMonthKey] = useState("");
  const [simulation, setSimulation] = useState(null);
  const [newCharity, setNewCharity] = useState({ name: "", description: "", image: "" });
  const [savingKey, setSavingKey] = useState("");
  const [simulationMode, setSimulationMode] = useState(true);
  const [searchUsers, setSearchUsers] = useState("");

  const loadAdminData = useCallback(async () => {
    try {
      const [u, s, c, cl] = await Promise.all([
        api.adminListUsers(token),
        api.adminListSubscriptions(token),
        api.adminListCharities(token),
        api.adminListWinnerClaims(token),
      ]);
      setUsers(u.users || []);
      setSubscriptions(s.subscriptions || []);
      setCharities(c.charities || []);
      setClaims(cl.claims || []);
    } catch (error) {
      onError(error.message);
    } finally {
      setInitialLoading(false);
    }
  }, [onError, token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAdminData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadAdminData]);

  const parseDrawNumbers = () => {
    if (!drawNumbers.trim()) return undefined;
    return drawNumbers
      .split(",")
      .map((n) => Number(n.trim()))
      .filter((n) => !Number.isNaN(n));
  };

  const updateUser = async (userId, payload) => {
    try {
      setSavingKey(`user-${userId}`);
      await api.adminUpdateUser(token, userId, payload);
      onSuccess("User updated.");
      await loadAdminData();
    } catch (error) {
      onError(error.message);
    } finally {
      setSavingKey("");
    }
  };

  const runSimulation = async () => {
    try {
      const result = await api.adminSimulateDraw(token, {
        totalPool: Number(poolAmount),
        drawNumbers: parseDrawNumbers(),
      });
      setSimulation(result);
      onSuccess("Draw simulation completed.");
    } catch (error) {
      onError(error.message);
    }
  };

  const publishDraw = async () => {
    try {
      await api.adminPublishDraw(token, {
        totalPool: Number(poolAmount),
        drawNumbers: parseDrawNumbers(),
        monthKey: drawMonthKey || undefined,
      });
      onSuccess("Monthly draw published.");
      await loadAdminData();
    } catch (error) {
      onError(error.message);
    }
  };

  const createCharity = async () => {
    try {
      await api.adminCreateCharity(token, newCharity);
      setNewCharity({ name: "", description: "", image: "" });
      onSuccess("Charity created.");
      await loadAdminData();
    } catch (error) {
      onError(error.message);
    }
  };

  const toggleCharityStatus = async (charity) => {
    try {
      setSavingKey(`charity-${charity._id}`);
      await api.adminUpdateCharity(token, charity._id, { isActive: !charity.isActive });
      onSuccess(`Charity ${charity.isActive ? "archived" : "restored"}.`);
      await loadAdminData();
    } catch (error) {
      onError(error.message);
    } finally {
      setSavingKey("");
    }
  };

  const verifyClaim = async (claim, status) => {
    try {
      await api.adminVerifyWinner(token, claim.drawId, claim.winnerId, status);
      onSuccess(`Winner ${status}.`);
      await loadAdminData();
    } catch (error) {
      onError(error.message);
    }
  };

  const markPaid = async (claim) => {
    try {
      await api.adminMarkWinnerPaid(token, claim.drawId, claim.winnerId);
      onSuccess("Winner marked as paid.");
      await loadAdminData();
    } catch (error) {
      onError(error.message);
    }
  };

  const adminMetrics = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === "active").length;
    const pendingClaims = claims.filter((c) => c.verificationStatus === "pending").length;
    const payoutTotal = claims.reduce((sum, claim) => sum + (claim.payoutAmount || 0), 0);
    const subHealthPct =
      subscriptions.length > 0 ? Math.round((activeSubs / subscriptions.length) * 1000) / 10 : 0;

    return { activeSubs, pendingClaims, payoutTotal, subHealthPct };
  }, [subscriptions, claims]);

  const claimTone = (status) => {
    if (status === "approved") return "active";
    if (status === "rejected") return "rejected";
    return "pending";
  };

  if (initialLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid gap-5 md:gap-6 lg:grid-cols-3">
        <Card className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-[#9CA3AF]">Subscription health</p>
            <LineChart className="h-4 w-4 shrink-0 text-green-700 dark:text-[#22C55E]/80" aria-hidden />
          </div>
          <p className="mt-2 text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-neutral-800 dark:text-[#E5E7EB]">
            {adminMetrics.subHealthPct}%
          </p>
          <p className="mt-1 text-xs text-green-700 dark:text-[#22C55E]">Active vs. total records</p>
          <div className="mt-3 h-2 rounded-full bg-neutral-200 dark:bg-white/10">
            <div
              className="h-2 rounded-full bg-[#22C55E] transition-all duration-300"
              style={{ width: `${Math.min(100, adminMetrics.subHealthPct)}%` }}
            />
          </div>
        </Card>
        <Card className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-[#9CA3AF]">Members</p>
            <Users className="h-4 w-4 shrink-0 text-green-700 dark:text-[#22C55E]/80" aria-hidden />
          </div>
          <p className="mt-8 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-neutral-800 dark:text-[#E5E7EB]">{users.length}</p>
          <p className={`mt-1 text-xs ${sublabelClass}`}>Registered accounts</p>
        </Card>
        <Card className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-[#9CA3AF]">Recorded payouts</p>
            <Building2 className="h-4 w-4 shrink-0 text-green-700 dark:text-[#22C55E]/80" aria-hidden />
          </div>
          <p className="mt-8 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-neutral-800 dark:text-[#E5E7EB]">
            ${adminMetrics.payoutTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className={`mt-1 text-xs ${sublabelClass}`}>Sum of payout amounts on file</p>
        </Card>
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-600/25 bg-green-100 text-green-800 dark:border-green-500/20 dark:bg-green-500/10 dark:text-[#22C55E]">
              <Trophy className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">Draw control</h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-[#9CA3AF]">Simulate outcomes or publish the monthly draw.</p>
            </div>
          </div>
          <div className="grid gap-3">
            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-neutral-600 dark:text-[#9CA3AF]" htmlFor="pool-amount">
                Pool amount
              </label>
              <Input
                id="pool-amount"
                className="mt-1"
                inputMode="decimal"
                placeholder="e.g. 10000"
                value={poolAmount}
                onChange={(e) => setPoolAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-neutral-600 dark:text-[#9CA3AF]" htmlFor="draw-numbers">
                Draw numbers (optional)
              </label>
              <Input
                id="draw-numbers"
                className="mt-1"
                placeholder="1, 7, 14, 21, 35"
                value={drawNumbers}
                onChange={(e) => setDrawNumbers(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-neutral-600 dark:text-[#9CA3AF]" htmlFor="month-key">
                Month key (optional)
              </label>
              <Input
                id="month-key"
                className="mt-1"
                placeholder="2026-03"
                value={drawMonthKey}
                onChange={(e) => setDrawMonthKey(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200/90 bg-neutral-100 p-3 dark:border-white/10 dark:bg-black/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-800 dark:text-[#E5E7EB]">Simulation Mode</p>
              <button
                type="button"
                onClick={() => setSimulationMode((prev) => !prev)}
                className={`h-6 w-12 rounded-full transition-all duration-200 ${
                  simulationMode ? "bg-[#22C55E]" : "bg-neutral-300 dark:bg-white/20"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition-transform duration-200 ${
                    simulationMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-green-600/25 bg-emerald-50/80 p-3 shadow-sm dark:border-green-500/20 dark:bg-black/20 dark:shadow-[0_0_0_1px_rgba(34,197,94,0.12),0_0_24px_rgba(34,197,94,0.1)]">
            <p className="text-xs uppercase tracking-[0.12em] text-green-800 dark:text-[#22C55E]">Next draw window</p>
            <p className="mt-2 text-lg font-semibold text-neutral-800 motion-safe:animate-pulse dark:text-[#E5E7EB]">02:14:55:10</p>
            <p className="mt-1 text-xs text-neutral-600 dark:text-[#9CA3AF]">Countdown to monthly reveal window.</p>
          </div>
          <Button
            variant="primary"
            className="w-full py-3 text-base shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_0_26px_rgba(34,197,94,0.22)] hover:scale-105"
            onClick={simulationMode ? runSimulation : publishDraw}
          >
            {simulationMode ? "Run Simulation" : "Run Draw Now"}
          </Button>
          {simulation ? (
            <div className="rounded-xl border border-neutral-200/90 bg-neutral-100 p-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-black/20 dark:text-[#9CA3AF]">
              <p>
                Numbers: <span className="text-green-700 dark:text-[#22C55E]">{simulation.drawNumbers?.join(", ")}</span>
              </p>
              <p>Participants: {simulation.eligibleParticipants}</p>
            </div>
          ) : null}
        </Card>

        <Card className="p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/90 bg-neutral-100 text-neutral-800 dark:border-white/10 dark:bg-white/5 dark:text-[#E5E7EB]">
                <Gavel className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">Winner verification</h3>
                <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Review proof uploads and payout readiness.</p>
              </div>
            </div>
            <Badge tone="pending">{adminMetrics.pendingClaims} pending</Badge>
          </div>
          <div className="space-y-2">
            {claims.slice(0, 4).map((claim) => (
              <article key={`${claim.drawId}-${claim.winnerId}`} className={`rounded-xl border p-3 ${panelClass}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`font-medium ${labelClass}`}>{claim.user?.name || "Unknown user"}</p>
                    <p className={mutedClass}>Round: {claim.monthKey} • Match {claim.matchCount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {claim.proofImageUrl ? (
                      <a href={getAssetUrl(claim.proofImageUrl)} target="_blank" rel="noreferrer" className="text-xs underline">
                        Proof
                      </a>
                    ) : (
                      <span className="text-xs text-rose-600 dark:text-rose-300">No proof</span>
                    )}
                    <Badge tone={claimTone(claim.verificationStatus)}>
                      {claim.verificationStatus}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                    onClick={() => verifyClaim(claim, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                    onClick={() => verifyClaim(claim, "rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    className="px-3 py-1 text-xs"
                    onClick={() => markPaid(claim)}
                  >
                    Mark Paid
                  </Button>
                </div>
              </article>
            ))}
            {!claims.length ? <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">No claims in queue.</p> : null}
          </div>
        </Card>
      </div>

      <Card className="p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/90 bg-neutral-100 text-neutral-800 dark:border-white/10 dark:bg-white/5 dark:text-[#E5E7EB]">
              <Users className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">User management</h3>
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Roles, access, and subscription labels.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              className="w-48 py-2"
              placeholder="Filter users..."
              value={searchUsers}
              onChange={(e) => setSearchUsers(e.target.value)}
            />
            <Button variant="secondary" className="py-2">Export</Button>
          </div>
        </div>
        <div className="grid gap-2">
          {users
            .filter((u) => {
              if (!searchUsers.trim()) return true;
              const q = searchUsers.toLowerCase();
              return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
            })
            .slice(0, 6)
            .map((u) => (
              <article key={u._id} className={`rounded-xl border p-3 ${panelClass}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`font-medium ${labelClass}`}>{u.name}</p>
                    <p className={mutedClass}>{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={u.role === "admin" ? "pending" : "active"}>{u.role}</Badge>
                    <Badge tone={u.subscriptionStatus === "active" ? "active" : "muted"}>
                      {u.subscriptionStatus}
                    </Badge>
                    <Button
                      variant="secondary"
                      className="px-3 py-1 text-xs"
                      onClick={() => updateUser(u._id, { role: u.role === "admin" ? "user" : "admin" })}
                      disabled={savingKey === `user-${u._id}`}
                    >
                      Toggle Role
                    </Button>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/90 bg-neutral-100 text-neutral-800 dark:border-white/10 dark:bg-white/5 dark:text-[#E5E7EB]">
              <Building2 className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">Charity partners</h3>
              <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Profiles, visibility, and routing.</p>
            </div>
          </div>
          <Button variant="secondary">Add Organization</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {charities.slice(0, 3).map((charity) => (
            <article key={charity._id} className={`rounded-xl border p-3 ${panelClass}`}>
              <p className={`font-semibold ${labelClass}`}>{charity.name}</p>
              <p className={`mt-1 text-xs ${mutedClass}`}>{charity.description?.slice(0, 60) || "Charity profile"}</p>
              <div className="mt-3 flex items-center justify-between">
                <Badge tone={charity.isActive ? "active" : "pending"}>
                  {charity.isActive ? "active" : "archived"}
                </Badge>
                <Button
                  variant="secondary"
                  className="px-3 py-1 text-xs"
                  onClick={() => toggleCharityStatus(charity)}
                  disabled={savingKey === `charity-${charity._id}`}
                >
                  Settings
                </Button>
              </div>
            </article>
          ))}
          <article className={`rounded-xl border border-dashed p-3 ${panelClass}`}>
            <div className="flex h-full min-h-24 items-center justify-center">
              <Button
                variant="secondary"
                onClick={createCharity}
                disabled={!newCharity.name || !newCharity.description || !newCharity.image}
              >
                Partner with Charity
              </Button>
            </div>
          </article>
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboard;
