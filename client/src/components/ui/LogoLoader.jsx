import { useId } from "react";
import Logo from "./Logo";

/**
 * Centered loading state with animated ring + ParImpact mark.
 */
function LogoLoader({ label = "Loading…" }) {
  const uid = useId().replace(/:/g, "");
  const gid = `pi-loader-grad-${uid}`;
  const circumference = 2 * Math.PI * 26;

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <div className="relative flex h-[5.5rem] w-[5.5rem] items-center justify-center">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14532D" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          >
            <animate
              attributeName="stroke-dashoffset"
              values={`${circumference};0;${circumference}`}
              dur="1.2s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
              keyTimes="0;0.5;1"
            />
          </circle>
        </svg>
        <div className="relative z-10 [&_.pi-logo-group]:hover:scale-100 [&_.pi-logo-group]:hover:brightness-100">
          <Logo variant="mark" size="small" showText={false} animated />
        </div>
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-[#9CA3AF]">
        {label}
      </p>
    </div>
  );
}

export default LogoLoader;
