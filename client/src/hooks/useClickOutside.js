import { useEffect } from "react";

/**
 * @param {React.RefObject<HTMLElement | null>} ref
 * @param {(event: MouseEvent | TouchEvent) => void} handler
 * @param {boolean} [enabled=true]
 */
export function useClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const el = (e) => {
      const node = ref.current;
      if (!node || node.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener("mousedown", el);
    document.addEventListener("touchstart", el);
    return () => {
      document.removeEventListener("mousedown", el);
      document.removeEventListener("touchstart", el);
    };
  }, [ref, handler, enabled]);
}
