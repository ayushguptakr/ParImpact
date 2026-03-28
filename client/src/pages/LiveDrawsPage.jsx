import { useMemo } from "react";
import { CalendarClock, Coins, Users } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useApp } from "../context/AppContext";
import { MOCK_LIVE_DRAWS } from "../data/mockAppData";
import { matchesSearch } from "../utils/filterSearch";

function LiveDrawsPage() {
  const { searchQuery, latestDraw, showToast } = useApp();

  const rows = useMemo(() => {
    const merged = [...MOCK_LIVE_DRAWS];
    if (latestDraw?.drawNumbers?.length) {
      merged.unshift({
        id: "current",
        name: "Your latest synced draw",
        status: "Synced",
        closesIn: "—",
        pool: "Live",
        entries: String(latestDraw.drawNumbers.length),
      });
    }
    if (!searchQuery.trim()) return merged;
    return merged.filter((r) =>
      matchesSearch(searchQuery, [r.name, r.status, r.pool, r.entries, r.closesIn])
    );
  }, [latestDraw, searchQuery]);

  return (
    <div className="space-y-6">
      <header className="surface-glass rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-green-800 dark:text-[#22C55E]">Live draws</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB] md:text-3xl">
          Pools, schedules, and entry windows
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-[#9CA3AF]">
          Follow active charity draws and upcoming rounds. When the backend is connected, live timers and
          eligibility will update automatically. Search filters the table below.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-green-800 dark:text-[#22C55E]">
            <Coins className="h-5 w-5" aria-hidden />
            <span className="text-sm font-medium">Prize liquidity</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">$23.4k</p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-[#9CA3AF]">Simulated pool across open draws.</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-green-800 dark:text-[#22C55E]">
            <Users className="h-5 w-5" aria-hidden />
            <span className="text-sm font-medium">Members in</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">2,342</p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-[#9CA3AF]">Rolling 30-day participation.</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-green-800 dark:text-[#22C55E]">
            <CalendarClock className="h-5 w-5" aria-hidden />
            <span className="text-sm font-medium">Next lock</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">4h 18m</p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-[#9CA3AF]">Countdown to next draw freeze.</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-[var(--pi-border)] px-5 py-4 dark:border-white/5">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-[#E5E7EB]">Draw directory</h2>
          <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
            {rows.length} result{rows.length === 1 ? "" : "s"}
            {searchQuery.trim() ? ` for “${searchQuery.trim()}”` : ""}.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-neutral-50/80 text-xs uppercase tracking-[0.12em] text-neutral-500 dark:bg-white/5 dark:text-gray-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Draw</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Closes in</th>
                <th className="px-5 py-3 font-semibold">Pool</th>
                <th className="px-5 py-3 font-semibold">Entries</th>
                <th className="px-5 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-neutral-200/50 dark:border-white/5"
                >
                  <td className="px-5 py-4 font-medium text-neutral-800 dark:text-[#E5E7EB]">{row.name}</td>
                  <td className="px-5 py-4">
                    <Badge
                      tone={
                        row.status === "Open"
                          ? "active"
                          : row.status === "Scheduled" || row.status === "Synced"
                            ? "muted"
                            : "pending"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-neutral-600 dark:text-[#9CA3AF]">{row.closesIn}</td>
                  <td className="px-5 py-4 text-neutral-800 dark:text-[#E5E7EB]">{row.pool}</td>
                  <td className="px-5 py-4 text-neutral-600 dark:text-[#9CA3AF]">{row.entries}</td>
                  <td className="px-5 py-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-3 py-1.5 text-xs"
                      onClick={() =>
                        showToast(
                          "Draw details (rules, splits, eligibility) will load from the API when available.",
                          "info"
                        )
                      }
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length ? (
          <p className="px-5 py-8 text-center text-sm text-neutral-600 dark:text-[#9CA3AF]">
            No draws match your search. Clear the search bar to see all.
          </p>
        ) : null}
      </Card>
    </div>
  );
}

export default LiveDrawsPage;
