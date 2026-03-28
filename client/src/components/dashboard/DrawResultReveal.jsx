import { useEffect, useMemo, useState } from "react";

function DrawResultReveal({ drawNumbers = [], userPicks = [], matchCount = 0 }) {
  const [revealedCount, setRevealedCount] = useState(0);

  const hasDraw = Array.isArray(drawNumbers) && drawNumbers.length === 5;
  const safePicks = useMemo(() => (userPicks?.length === 5 ? userPicks : [3, 9, 17, 24, 38]), [userPicks]);
  const safeDraw = useMemo(() => (hasDraw ? drawNumbers : [7, 12, 19, 27, 41]), [drawNumbers, hasDraw]);
  const drawSignature = safeDraw.join("-");
  const effectiveMatches = Number.isFinite(matchCount)
    ? matchCount
    : safeDraw.filter((num) => safePicks.includes(num)).length;
  const isWin = effectiveMatches >= 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev >= 5) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 240);
    return () => clearInterval(timer);
  }, [drawSignature]);

  return (
    <section className="surface-glass relative overflow-hidden rounded-2xl p-6 shadow-lg transition-colors duration-200 dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)]">
      {isWin ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
          {[...Array(10)].map((_, idx) => (
            <span
              key={idx}
              className="absolute h-2 w-2 animate-ping rounded-full bg-[#22C55E]"
              style={{ left: `${8 + idx * 9}%`, top: `${10 + (idx % 5) * 14}%`, animationDelay: `${idx * 90}ms` }}
            />
          ))}
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-white/[0.04] dark:to-transparent" />
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.12em] text-neutral-600 dark:text-gray-400">Draw Result Reveal</p>
        <h3 className="mt-2 text-2xl font-semibold leading-[1.08] tracking-[-0.02em] text-neutral-900 dark:text-[#E5E7EB]">
          {effectiveMatches > 0 ? `You matched ${effectiveMatches} number${effectiveMatches > 1 ? "s" : ""}!` : "Reveal in progress"}
        </h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-gray-400">Every round contributes to a cause.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {safeDraw.map((number, idx) => {
            const revealed = idx < revealedCount;
            const matched = safePicks.includes(number);
            return (
              <span
                key={`${number}-${idx}`}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-semibold transition-all duration-300 ease-in-out ${
                  !revealed
                    ? "scale-90 border-neutral-200 bg-neutral-100 text-transparent dark:border-white/10 dark:bg-black/20"
                    : matched
                      ? "scale-100 border-green-600/40 bg-green-100 text-green-900 dark:border-green-500/35 dark:bg-green-500/20 dark:text-[#22C55E]"
                      : "scale-100 border-neutral-200/80 bg-neutral-100/90 text-neutral-800 dark:border-white/10 dark:bg-black/20 dark:text-[#E5E7EB]"
                }`}
              >
                {revealed ? number : "•"}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DrawResultReveal;
