import { Heart, Flag, CheckCircle } from "lucide-react";

function LiveImpactSnapshot() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#07110D]/90 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] animate-[pi-fade-in_0.8s_ease-out_forwards] opacity-0">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Left Section: Live Impact Stats */}
        <div className="flex flex-col space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Live Impact</h3>
          <div className="flex flex-col gap-4">
            
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <Heart className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Donated this month</p>
                <p className="text-lg font-bold text-green-400">₹1,480</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Active programs</p>
                <p className="text-lg font-bold text-green-400">27</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <Flag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Rounds played</p>
                <p className="text-lg font-bold text-green-400">112</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Section: Recent Activity */}
        <div className="flex flex-col space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Recent Activity</h3>
          <div className="flex flex-col">
            
            <div className="flex items-start gap-3 border-b border-white/5 pb-3">
              <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
              <p className="text-sm text-gray-300">
                Rahul logged score 38 <span className="text-gray-500">→</span> <span className="font-medium text-green-400/80">₹120 donated</span>
              </p>
            </div>

            <div className="flex items-start gap-3 border-b border-white/5 py-3">
              <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
              <p className="text-sm text-gray-300">
                3 new members joined today
              </p>
            </div>

            <div className="flex items-start gap-3 pt-3">
              <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
              <p className="text-sm text-gray-300">
                Charity: Education Fund received <span className="font-medium text-green-400/80">₹500</span>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default LiveImpactSnapshot;
