import CTASection from "./CTASection";
import Footer from "./Footer";

const AppShell = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <CTASection />
      <Footer />
    </div>
  );
};

export default AppShell;
