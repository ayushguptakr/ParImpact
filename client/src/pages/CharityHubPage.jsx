import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HeartHandshake, ShieldCheck } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useApp } from "../context/AppContext";
import { matchesSearch } from "../utils/filterSearch";
import { scrollToSection } from "../utils/scrollLanding";

function CharityHubPage() {
  const navigate = useNavigate();
  const { charities, user, searchQuery, showToast } = useApp();

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return charities;
    return charities.filter((c) => matchesSearch(searchQuery, [c.name, c.description || ""]));
  }, [charities, searchQuery]);

  return (
    <div className="space-y-6">
      <header className="surface-glass rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-green-800 dark:text-[#22C55E]">Charity hub</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-800 dark:text-[#E5E7EB] md:text-3xl">
          Transparent routing to causes you care about
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-[#9CA3AF]">
          Browse partner organizations, review impact notes, and align your membership contribution. Your
          current selection is highlighted; search narrows the directory.
        </p>
      </header>

      <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-green-100 p-2.5 text-green-800 dark:bg-green-500/15 dark:text-[#22C55E]">
            <HeartHandshake className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-[#9CA3AF]">
              Your beneficiary
            </p>
            <p className="mt-1 text-xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">
              {user?.charity?.name || "None selected"}
            </p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-[#9CA3AF]">
              Contribution: {user?.contributionPercentage ?? 10}% of eligible round fees (simulated).
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="shrink-0"
          onClick={() => {
            navigate("/dashboard");
            window.setTimeout(() => scrollToSection("charity-contribution"), 120);
          }}
        >
          Update on Dashboard
        </Button>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((c) => (
          <Card key={c._id} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-[#E5E7EB]">{c.name}</h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-[#9CA3AF]">
                  {c.description || "Partner charity supporting health, youth sport, and local communities."}
                </p>
              </div>
              <ShieldCheck className="h-5 w-5 shrink-0 text-green-700 dark:text-[#22C55E]" aria-hidden />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                className="text-xs"
                onClick={() =>
                  showToast("Charter PDFs will open here when documents are linked to each partner.", "info")
                }
              >
                View charter
              </Button>
              <Button
                type="button"
                variant="primary"
                className="text-xs"
                onClick={() => {
                  navigate("/dashboard");
                  window.setTimeout(() => scrollToSection("charity-contribution"), 120);
                }}
              >
                Route impact here
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {!charities.length ? (
        <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
          No charities loaded from the server yet. They will appear here when the API is available.
        </p>
      ) : null}
      {charities.length > 0 && !filtered.length ? (
        <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">
          No partners match “{searchQuery.trim()}”.
        </p>
      ) : null}
    </div>
  );
}

export default CharityHubPage;
