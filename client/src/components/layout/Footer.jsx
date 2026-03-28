import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

function Footer() {
  return (
    <footer className="w-full border-t border-green-500/10 bg-gradient-to-r from-black via-[#0a1f14] to-[#0f2a1c] text-gray-300 animate-[pi-fade-in_0.8s_ease-out_forwards] opacity-0">
      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          
          {/* LEFT BRAND */}
          <div className="flex flex-col items-center space-y-4 text-center md:items-start md:text-left">
            <Logo variant="inline" size="medium" animated={false} className="mb-1" />
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              Empowering golfers to create real-world impact through every round.
            </p>
          </div>

          {/* CENTER NAVIGATION */}
          <div className="flex flex-col items-center space-y-4 text-center md:items-start md:text-left">
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase">Platform</h4>
            <nav className="flex flex-col items-center space-y-3 md:items-start">
              <Link to="/#how-it-works" className="text-sm transition-all duration-200 hover:scale-105 hover:text-green-300">How it Works</Link>
              <Link to="/charity-hub" className="text-sm transition-all duration-200 hover:scale-105 hover:text-green-300">Charity Hub</Link>
              <Link to="/live-draws" className="text-sm transition-all duration-200 hover:scale-105 hover:text-green-300">Live Draws</Link>
              <Link to="/#impact" className="text-sm transition-all duration-200 hover:scale-105 hover:text-green-300">Impact</Link>
            </nav>
          </div>

          {/* RIGHT SUPPORT */}
          <div className="flex flex-col items-center space-y-4 text-center md:items-start md:text-left">
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase">Support</h4>
            <div className="flex flex-col items-center space-y-3 md:items-start">
              <a href="mailto:support@parimpact.com" className="text-sm transition-all duration-200 hover:scale-105 hover:text-green-300">
                support@parimpact.com
              </a>
              <Link to="#" className="text-sm transition-all duration-200 hover:scale-105 hover:text-green-300">Privacy Policy</Link>
              <Link to="#" className="text-sm transition-all duration-200 hover:scale-105 hover:text-green-300">Terms of Service</Link>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 flex flex-col items-center justify-between space-y-4 border-t border-green-500/10 pt-8 text-xs text-gray-500 md:flex-row md:space-y-0 text-center md:text-left">
          <p>© 2026 ParImpact. All rights reserved.</p>
          <p className="text-green-400">Built for impact-driven golfers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
