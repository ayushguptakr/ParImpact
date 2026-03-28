import { useState } from "react";
import { ClipboardList, Heart, Layers, Trophy } from "lucide-react";

const steps = [
  {
    id: 1,
    number: "01",
    title: "Play & Submit Score",
    description: "Log your round (score between 1–45). Your performance on the course is where the journey begins.",
    Icon: ClipboardList,
  },
  {
    id: 2,
    number: "02",
    title: "Contribution Allocation",
    description: "A portion of your play contributes to your selected charity. You choose where your impact goes.",
    Icon: Heart,
  },
  {
    id: 3,
    number: "03",
    title: "Draw Pool Formation",
    description: "All contributions are pooled transparently. Every golfer's input builds a collective force for good.",
    Icon: Layers,
  },
  {
    id: 4,
    number: "04",
    title: "Winner Selection",
    description: "A fair algorithm selects winners monthly. Transparent, verifiable, and always impact-driven.",
    Icon: Trophy,
  },
];

function DrawEngineFlow() {
  const [activeStep, setActiveStep] = useState(1);
  const active = steps.find((s) => s.id === activeStep);

  return (
    <section
      id="draw-engine"
      className="scroll-mt-24 animate-[pi-fade-in_0.8s_ease-out_forwards] opacity-0 md:scroll-mt-28"
    >
      {/* Header */}
      <div className="mb-10 text-center md:mb-12">
        <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          How the Draw Engine Works
        </h3>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Transparent. Fair. Impact-driven.
        </p>
      </div>

      {/* Step Cards Grid */}
      <div className="relative">
        {/* Connecting line (desktop) */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 hidden -translate-y-1/2 md:block">
          <div className="mx-auto h-px w-[calc(100%-80px)] bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {steps.map((step) => {
            const isActive = step.id === activeStep;
            const Icon = step.Icon;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`group relative flex flex-col items-center gap-3 rounded-xl border px-5 py-6 text-center backdrop-blur-md transition-all duration-300 hover:scale-[1.03] ${
                  isActive
                    ? "border-green-500/40 bg-green-500/10 shadow-[0_0_25px_rgba(34,197,94,0.15)] dark:border-green-400/30 dark:bg-green-500/10 dark:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                    : "border-gray-200 bg-white/80 shadow-sm hover:border-green-500/20 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-green-500/20 dark:hover:shadow-[0_0_15px_rgba(34,197,94,0.08)]"
                }`}
              >
                {/* Step Number */}
                <span
                  className={`text-[11px] font-bold uppercase tracking-widest ${
                    isActive ? "text-green-600 dark:text-green-400" : "text-gray-400"
                  }`}
                >
                  Step {step.number}
                </span>

                {/* Icon */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300 ${
                    isActive
                      ? "bg-green-500/15 text-green-600 dark:text-green-400"
                      : "bg-gray-100 text-gray-500 group-hover:bg-green-500/10 group-hover:text-green-600 dark:bg-white/5 dark:text-gray-400 dark:group-hover:text-green-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title */}
                <span
                  className={`text-sm font-semibold leading-snug ${
                    isActive ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {step.title}
                </span>

                {/* Active arrow indicator */}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M6 8L0 0H12L6 8Z" className="fill-green-500/60 dark:fill-green-400/60" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Description */}
      {active && (
        <div
          key={active.id}
          className="mx-auto mt-8 max-w-xl animate-[pi-fade-in_0.4s_ease-out_forwards] rounded-xl border border-gray-200 bg-white/90 px-6 py-5 text-center shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/5"
        >
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {active.description}
          </p>
        </div>
      )}
    </section>
  );
}

export default DrawEngineFlow;
