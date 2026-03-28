/** Sticky public navbar approximate height + safe gap */
const NAV_SCROLL_OFFSET_PX = 88;

/**
 * Smooth-scroll so the target section clears the sticky navbar.
 * @param {string} id Element id (without #)
 */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET_PX;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
