import { useId } from "react";

export const LOGO_ALT = "ParImpact - Play with Purpose";

/** @typedef {'small' | 'medium' | 'large'} LogoSize */

const SIZE_HEIGHT = {
  small: 32,
  medium: 40,
  large: 44,
};

/**
 * ParImpact inline SVG brand — flag wave, hover glow, ripple (CSS).
 * @param {object} props
 * @param {'navbar' | 'sidebar' | 'inline' | 'mark'} [props.variant]
 * @param {LogoSize} [props.size] — when not `navbar`
 * @param {boolean} [props.showText]
 * @param {boolean} [props.animated]
 * @param {string} [props.className]
 */
function Logo({
  variant = "navbar",
  size: sizeProp,
  showText: showTextProp,
  animated: animatedProp = true,
  className = "",
}) {
  if (variant === "navbar") {
    return (
      <div className={`group flex cursor-pointer items-center gap-3 transition-all duration-200 hover:scale-[1.02] ${className}`} title={LOGO_ALT}>
        <div className="sm:hidden">
          <LogoSvg size="small" animated={animatedProp} />
        </div>
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          <LogoSvg size="medium" animated={animatedProp} />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              <span className="text-green-500">Par</span>Impact
            </span>
            <span className="text-[11px] text-gray-600 dark:text-gray-300 sm:hidden md:block">
              Play with Purpose
            </span>
          </div>
        </div>
      </div>
    );
  }

  const size = sizeProp ?? (variant === "sidebar" || variant === "mark" ? "small" : "medium");
  const showText = showTextProp ?? (variant === "inline");

  return (
    <div className={`group flex cursor-pointer items-center gap-3 transition-all duration-200 hover:scale-[1.02] ${className}`} title={LOGO_ALT}>
      {showText ? (
        <div className="flex items-center gap-3">
          <LogoSvg size={size} animated={animatedProp} />
          <div className="flex flex-col leading-tight">
            <span className={`font-bold tracking-tight text-gray-900 dark:text-white ${size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-lg'}`}>
              <span className="text-green-500">Par</span>Impact
            </span>
            <span className={`text-gray-600 dark:text-gray-300 ${size === 'large' ? 'text-sm' : size === 'medium' ? 'text-[11px]' : 'text-[10px]'}`}>
              Play with Purpose
            </span>
          </div>
        </div>
      ) : (
        <LogoSvg size={size} animated={animatedProp} />
      )}
    </div>
  );
}

/**
 * @param {object} p
 * @param {LogoSize} p.size
 * @param {boolean} p.animated
 */
function LogoSvg({ size, animated }) {
  const uid = useId().replace(/:/g, "");
  const gradRing = `pi-ring-${uid}`;
  const gradGlow = `pi-glow-${uid}`;
  const h = SIZE_HEIGHT[size];
  const w = (h * 66) / 60;

  return (
    <span className="pi-logo-group inline-flex shrink-0 cursor-default select-none items-center justify-center transition-[transform,filter] duration-200 ease-out will-change-transform group-hover:brightness-110 dark:group-hover:brightness-125">
      <svg
        width={Math.round(w)}
        height={Math.round(h)}
        viewBox="0 0 66 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible text-neutral-800 drop-shadow-none transition-[filter] duration-200 group-hover:drop-shadow-[0_0_14px_rgba(34,197,94,0.28)] dark:drop-shadow-[0_0_6px_rgba(34,197,94,0.4)] dark:text-neutral-200"
        aria-hidden
        focusable="false"
      >
        <defs>
          <linearGradient id={gradRing} x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#14532D" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <radialGradient id={gradGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </radialGradient>
        </defs>

        <IconMark gradRing={gradRing} gradGlow={gradGlow} animated={animated} offsetX={10} offsetY={10} />
      </svg>
      <span className="sr-only">{LOGO_ALT}</span>
    </span>
  );
}

/**
 * @param {object} p
 * @param {string} p.gradRing
 * @param {string} p.gradGlow
 * @param {boolean} p.animated
 * @param {number} p.offsetX
 * @param {number} p.offsetY
 */
function IconMark({ gradRing, gradGlow, animated, offsetX, offsetY }) {
  return (
    <g transform={`translate(${offsetX},${offsetY})`}>
      <ellipse
        cx="30"
        cy="40"
        rx="26"
        ry="9"
        stroke={`url(#${gradRing})`}
        strokeWidth="2"
        opacity={0.88}
      />
      <ellipse
        className="pi-logo-ripple"
        cx="30"
        cy="40"
        rx="26"
        ry="9"
        stroke="#22C55E"
        strokeWidth="1.5"
        fill="none"
      />
      <ellipse cx="30" cy="40" rx="30" ry="12" fill={`url(#${gradGlow})`} className="opacity-0 group-hover:opacity-100" />
      <line x1="30" y1="15" x2="30" y2="40" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      <g>
        {animated ? (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-1 30 20; 1.2 30 20; -1 30 20"
            dur="2.8s"
            repeatCount="indefinite"
          />
        ) : null}
        <path d="M30 15 Q42 13 46 20 Q38 24 30 22 Z" fill="#4ADE80" />
      </g>
      <circle cx="14" cy="24" r="1.5" fill="#86EFAC" opacity={0.9} />
      <circle cx="11" cy="28" r="1" fill="#86EFAC" opacity={0.75} />
    </g>
  );
}

export default Logo;
