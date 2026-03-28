import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

function Footer() {
  return (
    <footer className="mt-20 w-full animate-[pi-fade-in_0.8s_ease-out_forwards] border-t border-gray-200 bg-white pt-16 text-gray-700 opacity-0 transition-colors duration-300 dark:border-green-500/10 dark:bg-gradient-to-r dark:from-[#0a0f0d] dark:via-[#0a1f14] dark:to-[#0f2a1c] dark:text-gray-300">
      <div className="mx-auto max-w-7xl px-8 pb-12">
        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3 md:gap-8 md:text-left lg:gap-12">
          
          {/* LEFT BRAND */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4 flex items-center gap-3">
              <Logo variant="mark" size="medium" animated={false} />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  ParImpact
                </span>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  Play with Purpose
                </span>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Empowering golfers to create real-world impact through every round.
            </p>
          </div>

          {/* CENTER NAVIGATION */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-400">Platform</h4>
            <nav className="flex flex-col items-center space-y-2 md:items-start">
              <Link to="/#how-it-works" className="text-sm font-medium transition-all duration-200 hover:scale-[1.03] hover:text-green-600 dark:hover:text-green-300">How it Works</Link>
              <Link to="/charity-hub" className="text-sm font-medium transition-all duration-200 hover:scale-[1.03] hover:text-green-600 dark:hover:text-green-300">Charity Hub</Link>
              <Link to="/live-draws" className="text-sm font-medium transition-all duration-200 hover:scale-[1.03] hover:text-green-600 dark:hover:text-green-300">Live Draws</Link>
              <Link to="/#impact" className="text-sm font-medium transition-all duration-200 hover:scale-[1.03] hover:text-green-600 dark:hover:text-green-300">Impact</Link>
            </nav>
          </div>

          {/* RIGHT SUPPORT */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-400">Support</h4>
            <div className="flex flex-col items-center space-y-2 md:items-start">
              <a href="mailto:support@parimpact.com" className="text-sm font-medium transition-all duration-200 hover:scale-[1.03] hover:text-green-600 dark:hover:text-green-300">
                support@parimpact.com
              </a>
              <Link to="#" className="text-sm font-medium transition-all duration-200 hover:scale-[1.03] hover:text-green-600 dark:hover:text-green-300">Privacy Policy</Link>
              <Link to="#" className="text-sm font-medium transition-all duration-200 hover:scale-[1.03] hover:text-green-600 dark:hover:text-green-300">Terms of Service</Link>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 flex flex-col items-center justify-between space-y-4 border-t border-gray-200 pt-8 text-xs text-gray-500 transition-colors duration-300 dark:border-white/10 md:flex-row md:space-y-0">
          <p>© 2026 ParImpact. All rights reserved.</p>
          <p className="font-medium text-green-600 dark:text-green-400">Built for impact-driven golfers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
