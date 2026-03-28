import { Link } from "react-router-dom";

function CTASection() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
      <section className="mb-12 mt-16 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-white px-8 py-12 text-center shadow-md animate-[pi-fade-in_0.8s_ease-out_forwards] transition-all duration-300 dark:border-green-500/10 dark:bg-gradient-to-r dark:from-[#0a1f14] dark:via-[#0f2a1c] dark:to-[#0a1f14] dark:shadow-[0_10px_40px_rgba(34,197,94,0.08)] md:px-12 md:py-16">
        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Label */}
          <span className="text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
            Ready to make an impact?
          </span>

          {/* Main Heading */}
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Play with purpose. Start your journey.
          </h2>

          {/* Supporting Text */}
          <p className="max-w-xl text-base text-gray-600 dark:text-gray-400 md:text-lg">
            Join ParImpact and turn every round into real-world change.
          </p>

          {/* Buttons */}
          <div className="mt-4 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Link
              to="/#join"
              className="w-full rounded-full bg-green-500 px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-green-600 sm:w-auto"
            >
              Join the Draw
            </Link>
            <Link
              to="/#how-it-works"
              className="w-full rounded-full border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 transition-all duration-200 hover:scale-105 hover:border-green-500 dark:border-white/20 dark:text-gray-300 dark:hover:border-green-400 sm:w-auto"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CTASection;
