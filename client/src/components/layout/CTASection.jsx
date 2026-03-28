import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

function CTASection() {
  const { token } = useApp();
  const isLoggedIn = Boolean(token);

  if (isLoggedIn) return null;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 mt-16 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white px-8 py-10 text-center shadow-md animate-[pi-fade-in_0.8s_ease-out_forwards] transition-all duration-300 hover:border-green-500/30 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] dark:border-green-500/10 dark:bg-gradient-to-r dark:from-[#0a1f14] dark:via-[#0f2a1c] dark:to-[#0a1f14] dark:shadow-[0_10px_40px_rgba(34,197,94,0.08)] dark:hover:border-green-500/30 dark:hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] md:px-12">
            {isLoggedIn ? (
              <div className="relative z-10 flex flex-col items-center space-y-6">
                <span className="text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                  Welcome back
                </span>
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                  Continue your impact journey
                </h2>
                <p className="max-w-xl text-base text-gray-600 dark:text-gray-400 md:text-lg">
                  Log your latest round and contribute to your chosen cause.
                </p>
                <div className="mt-4 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
                  <Link
                    to="/my-rounds"
                    className="w-full rounded-full bg-green-500 px-6 py-3 text-base font-semibold text-white shadow-[0_0_20px_rgba(34,197,94,0.25)] transition-all duration-200 hover:scale-[1.03] hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] sm:w-auto"
                  >
                    Enter Score
                  </Link>
                  <Link
                    to="/my-rounds"
                    className="w-full rounded-full border border-gray-200 px-6 py-3 text-base font-semibold text-gray-500 transition-all duration-200 hover:border-green-500/50 hover:bg-gray-50 hover:text-green-600 dark:border-white/10 dark:text-gray-400 dark:hover:border-green-500/50 dark:hover:bg-white/5 dark:hover:text-green-400 sm:w-auto"
                  >
                    View My Rounds
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center space-y-6">
                <span className="text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                  Ready to make an impact?
                </span>
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
                  Play with purpose. Start your journey.
                </h2>
                <p className="max-w-xl text-base text-gray-600 dark:text-gray-400 md:text-lg">
                  Turn every round into real-world impact.
                </p>
                <div className="mt-4 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
                  <Link
                    to="/#join"
                    className="w-full rounded-full bg-green-500 px-6 py-3 text-base font-semibold text-white shadow-[0_0_20px_rgba(34,197,94,0.25)] transition-all duration-200 hover:scale-[1.03] hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] sm:w-auto"
                  >
                    Join the Draw
                  </Link>
                  <Link
                    to="/#how-it-works"
                    className="w-full rounded-full border border-gray-200 px-6 py-3 text-base font-semibold text-gray-500 transition-all duration-200 hover:border-green-500/50 hover:bg-gray-50 hover:text-green-600 dark:border-white/10 dark:text-gray-400 dark:hover:border-green-500/50 dark:hover:bg-white/5 dark:hover:text-green-400 sm:w-auto"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;

