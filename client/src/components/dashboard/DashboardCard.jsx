function DashboardCard({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={`surface-glass rounded-2xl p-5 text-neutral-900 shadow-lg transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl md:p-6 dark:text-[#e5e7eb] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-neutral-900 md:text-xl dark:text-[#e5e7eb]">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-neutral-600 dark:text-[#9CA3AF]">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default DashboardCard;
