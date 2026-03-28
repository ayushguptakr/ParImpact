const AppShell = ({ children }) => {
  return (
    <main className="min-h-screen bg-surface-page px-6 py-8 text-neutral-900 transition-colors duration-200 dark:bg-[#0a0f0d] dark:text-[#e5e7eb] md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
};

export default AppShell;
