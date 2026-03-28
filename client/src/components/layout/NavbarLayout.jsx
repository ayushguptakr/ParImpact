/**
 * Shared marketing / app navbar shell: left brand, centered nav, right actions.
 * Single <nav> for links (no duplicate links for a11y).
 */
function NavbarLayout({
  left,
  center,
  right,
  ariaLabel = "Main navigation",
  navGapClass = "gap-1",
}) {
  return (
    <header className="navbar-shell h-18">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-6 py-3 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4 md:px-8 md:py-3.5">
        <div className="flex items-center justify-between gap-4 md:contents">
          <div className="min-w-0 md:justify-self-start">{left}</div>
          <div className="flex shrink-0 items-center gap-2 md:hidden">{right}</div>
        </div>

        <nav
          className={`flex flex-wrap justify-center border-t border-[var(--pi-border)] pt-3 dark:border-white/[0.06] md:col-start-2 md:row-start-1 md:flex-nowrap md:border-t-0 md:pt-0 ${navGapClass}`}
          aria-label={ariaLabel}
        >
          {center}
        </nav>

        <div className="hidden items-center justify-end gap-2 md:col-start-3 md:flex md:justify-self-end">
          {right}
        </div>
      </div>
    </header>
  );
}

export default NavbarLayout;
