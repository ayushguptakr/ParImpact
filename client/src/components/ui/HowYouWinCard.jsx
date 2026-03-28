import { CheckCircle, Trophy, BarChart3, Zap } from "lucide-react";

const points = [
  {
    Icon: CheckCircle,
    text: "Log your score after each round",
    delay: "0s",
  },
  {
    Icon: BarChart3,
    text: "Better consistency improves your chances",
    delay: "0.1s",
  },
  {
    Icon: Zap,
    text: "Every round contributes to the prize pool",
    delay: "0.2s",
  },
  {
    Icon: Trophy,
    text: "Winners are selected through a fair monthly draw",
    delay: "0.3s",
  },
];

function HowYouWinCard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-lg animate-[pi-fade-in_0.8s_ease-out_forwards] opacity-0 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_0_25px_rgba(34,197,94,0.12)] dark:hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
          How You Win
        </h3>

        {/* Points */}
        <div className="flex flex-col">
          {points.map((point, i) => {
            const Icon = point.Icon;
            return (
              <div
                key={i}
                className="opacity-0 animate-[pi-fade-in_0.5s_ease-out_forwards]"
                style={{ animationDelay: point.delay }}
              >
                {i > 0 && <div className="my-3 h-px w-full bg-gray-200 dark:bg-white/10" />}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {point.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Your Winning Potential
            </span>
            <span className="text-xs font-bold text-green-600 dark:text-green-400">65%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out"
              style={{ width: "65%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowYouWinCard;

