import { useMemo } from "react";
import { Flag, TrendingUp } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useApp } from "../context/AppContext";
import { matchesSearch } from "../utils/filterSearch";

function MyRoundsPage() {
  const { scores, searchQuery } = useApp();

  const display = useMemo(() => {
    if (!searchQuery.trim()) return scores;
    return scores.filter((s) =>
      matchesSearch(searchQuery, [String(s.value), new Date(s.date).toLocaleDateString()])
    );
  }, [scores, searchQuery]);

  const avg =
    display.length > 0
      ? (display.reduce((acc, s) => acc + Number(s.value), 0) / display.length).toFixed(1)
      : "—";

  return (
    <div className="space-y-6">
      <header className="surface-glass rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-green-800 dark:text-[#22C55E]">My rounds</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB] md:text-3xl">
          Rolling performance history
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-[#9CA3AF]">
          Scores sync from your account. The search bar filters this list by date or score value. Submit new
          rounds from the dashboard score card.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-green-100 p-2 text-green-800 dark:bg-green-500/15 dark:text-[#22C55E]">
              <Flag className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-[#9CA3AF]">
                Rounds in window
              </p>
              <p className="text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">{scores.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-green-100 p-2 text-green-800 dark:bg-green-500/15 dark:text-[#22C55E]">
              <TrendingUp className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-[#9CA3AF]">
                Filtered avg (visible)
              </p>
              <p className="text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">{avg}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 md:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-[#E5E7EB]">Round log</h2>
          <Badge tone="muted">{display.length} shown</Badge>
        </div>
        <ul className="space-y-3">
          {display.map((s) => {
            const key = `${s.value}-${s.date}`;
            return (
              <li
                key={key}
                className="flex items-center justify-between rounded-2xl border border-neutral-200/55 bg-neutral-50/80 px-4 py-3 dark:border-white/8 dark:bg-black/15"
              >
                <div>
                  <p className="font-medium text-neutral-800 dark:text-[#E5E7EB]">
                    {new Date(s.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-[#9CA3AF]">Recorded score entry</p>
                </div>
                <p className="text-3xl font-semibold text-green-800 dark:text-[#22C55E]">{s.value}</p>
              </li>
            );
          })}
        </ul>
        {!scores.length ? (
          <p className="mt-4 text-sm text-neutral-600 dark:text-[#9CA3AF]">
            No rounds yet. Log a score from Dashboard → Enter Latest Score.
          </p>
        ) : null}
        {scores.length > 0 && !display.length ? (
          <p className="mt-4 text-sm text-neutral-600 dark:text-[#9CA3AF]">
            No rounds match “{searchQuery.trim()}”. Try another search.
          </p>
        ) : null}
      </Card>
    </div>
  );
}

export default MyRoundsPage;
