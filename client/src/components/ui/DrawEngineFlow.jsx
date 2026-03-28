import { ShieldCheck, Eye, Scale, FileCheck } from "lucide-react";

const features = [
  {
    Icon: ShieldCheck,
    title: "Fair Randomization",
    description: "Winners are selected using unbiased and consistent logic.",
  },
  {
    Icon: Eye,
    title: "Transparent Pool",
    description: "All contributions are pooled and visible.",
  },
  {
    Icon: Scale,
    title: "Equal Opportunity",
    description: "Every valid round contributes fairly to the draw.",
  },
  {
    Icon: FileCheck,
    title: "No Hidden Rules",
    description: "Simple system with no manipulation or bias.",
  },
];

function DrawEngineFlow() {
  return (
    <section
      id="draw-engine"
      className="scroll-mt-24 animate-[pi-fade-in_0.8s_ease-out_forwards] opacity-0 md:scroll-mt-28"
    >
      {/* Header */}
      <div className="mb-10 flex flex-col items-center text-center md:mb-12">
        <span className="mb-3 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
          Verified System
        </span>
        <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          How the Draw Engine Works
        </h3>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Transparent. Fair. Built on trust.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {features.map((feature, i) => {
          const Icon = feature.Icon;
          return (
            <div
              key={i}
              className="group flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white/80 px-5 py-6 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] dark:border-white/10 dark:bg-white/5 dark:hover:border-green-500/25 dark:hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600 transition-colors duration-300 group-hover:bg-green-500/15 dark:bg-green-500/10 dark:text-green-400">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h4>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DrawEngineFlow;
