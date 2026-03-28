const setupChecklist = [
  "React + Vite frontend scaffolded",
  "Tailwind configured with Emerald Sand tokens",
  "Express API server initialized",
  "MongoDB connection bootstrap wired",
  "Modular backend folder architecture organized",
];

const SetupLanding = () => {
  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-neutral-200/55 bg-surface-raised px-6 py-8 text-neutral-800 shadow-soft-light transition-colors duration-300 dark:border-secondary-green/15 dark:bg-primary-dark dark:text-sand dark:shadow-none md:px-10">
        <p className="text-xs uppercase tracking-[0.22em] text-green-800 dark:text-accent-gold">Golf Charity Subscription Platform</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
          Production foundation ready for feature implementation
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-neutral-600 md:text-base dark:text-sand/85">
          Step 1 establishes the architecture, theme, and backend infrastructure. Functional modules
          (auth, subscriptions, scores, draws, and admin workflows) are implemented in subsequent
          steps.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {setupChecklist.map((item) => (
          <article
            key={item}
            className="rounded-2xl border border-neutral-200/55 bg-surface-raised p-5 shadow-soft-light transition-all duration-300 hover:-translate-y-0.5 dark:border-secondary-green/15 dark:bg-white/90 dark:shadow-soft"
          >
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SetupLanding;
