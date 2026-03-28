import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import PrivateLayout from "./components/layout/PrivateLayout";
import PrivateNavbar from "./components/layout/PrivateNavbar";
import PublicNavbar from "./components/layout/PublicNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import ToastStack from "./components/ui/ToastStack";
import { AppContext } from "./context/AppContext";
import LandingPage from "./pages/LandingPage";
import DashboardHome from "./pages/DashboardHome";
import LiveDrawsPage from "./pages/LiveDrawsPage";
import MyRoundsPage from "./pages/MyRoundsPage";
import CharityHubPage from "./pages/CharityHubPage";
import ProfilePage from "./pages/ProfilePage";
import { api } from "./lib/api";
import { scrollToSection } from "./utils/scrollLanding";

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState("register");
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("ui-theme") !== "light";
    } catch {
      return true;
    }
  });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [charities, setCharities] = useState([]);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [scores, setScores] = useState([]);
  const [latestDraw, setLatestDraw] = useState(null);

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    charityId: "",
    contributionPercentage: 10,
  });
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [selectedScore, setSelectedScore] = useState(null);
  const [charitySelection, setCharitySelection] = useState("");
  const [contributionSelection, setContributionSelection] = useState(10);

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback((message, variant = "success", duration = 3000) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message, variant }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const loadPublicCharities = async () => {
    try {
      const charityData = await api.getCharities();
      setCharities(charityData.charities || []);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const loadDashboard = async (activeToken) => {
    setLoading(true);
    try {
      const [userRes, subRes, scoresRes] = await Promise.all([
        api.getCurrentUser(activeToken),
        api.getMySubscription(activeToken),
        api.getMyScores(activeToken),
      ]);
      setUser(userRes.user);
      setSubscription(subRes.subscription);
      setScores(scoresRes.scores || []);
      setCharitySelection(userRes.user?.charity?._id || "");
      setContributionSelection(userRes.user?.contributionPercentage || 10);

      try {
        const latest = await api.getLatestDraw(activeToken);
        setLatestDraw(latest.draw || null);
      } catch {
        setLatestDraw(null);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("ui-theme", darkMode ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [darkMode]);

  useEffect(() => {
    loadPublicCharities();
  }, []);

  useEffect(() => {
    if (token) {
      loadDashboard(token);
    } else {
      setUser(null);
      setSubscription(null);
      setScores([]);
      setLatestDraw(null);
    }
  }, [token]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload =
        mode === "register"
          ? {
              name: authForm.name,
              email: authForm.email,
              password: authForm.password,
              charityId: authForm.charityId,
              contributionPercentage: Number(authForm.contributionPercentage),
            }
          : {
              email: authForm.email,
              password: authForm.password,
            };
      const result = mode === "register" ? await api.register(payload) : await api.login(payload);
      localStorage.setItem("authToken", result.token);
      setToken(result.token);
      showToast(
        mode === "register" ? "Welcome! Your account is ready." : "Welcome back.",
        "success",
        3000
      );
    } catch (err) {
      showToast(err.message, "error", 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    setToken("");
    setSearchQuery("");
    navigate("/");
    showToast("You're logged out.", "info", 2500);
  }, [navigate, showToast]);

  const handleSubscriptionSave = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await api.upsertSubscription(token, { plan: selectedPlan });
      await loadDashboard(token);
      showToast("Subscription updated.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleScoreAdd = async () => {
    if (!token || !selectedScore) return;
    setLoading(true);
    try {
      await api.addScore(token, { value: Number(selectedScore) });
      setSelectedScore(null);
      await loadDashboard(token);
      showToast("Score submitted.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCharityUpdate = async () => {
    if (!token || !charitySelection) return;
    setLoading(true);
    try {
      await api.updateCharitySelection(token, {
        charityId: charitySelection,
        contributionPercentage: Number(contributionSelection),
      });
      await loadDashboard(token);
      showToast("Charity contribution updated.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    if (location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate, token]);

  useEffect(() => {
    if (location.pathname !== "/admin") return;
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    if (user && user.role !== "admin") {
      showToast("Admin access is required.", "error");
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate, token, user, showToast]);

  const handlePublicLogin = () => {
    setMode("login");
    window.setTimeout(() => scrollToSection("auth-panel"), 80);
  };

  const handlePublicRegister = () => {
    setMode("register");
    window.setTimeout(() => scrollToSection("auth-panel"), 80);
  };

  const handleAdminError = useCallback(
    (msg) => {
      showToast(msg, "error");
    },
    [showToast]
  );

  const handleAdminSuccess = useCallback(
    (msg) => {
      showToast(msg, "success");
    },
    [showToast]
  );

  const appValue = useMemo(
    () => ({
      token,
      user,
      loading,
      searchQuery,
      setSearchQuery,
      showToast,
      charities,
      subscription,
      scores,
      latestDraw,
      selectedPlan,
      setSelectedPlan,
      selectedScore,
      setSelectedScore,
      charitySelection,
      setCharitySelection,
      contributionSelection,
      setContributionSelection,
      handleSubscriptionSave,
      handleScoreAdd,
      handleCharityUpdate,
      handleLogout,
    }),
    [
      token,
      user,
      loading,
      searchQuery,
      setSearchQuery,
      showToast,
      charities,
      subscription,
      scores,
      latestDraw,
      selectedPlan,
      setSelectedPlan,
      selectedScore,
      setSelectedScore,
      charitySelection,
      setCharitySelection,
      contributionSelection,
      setContributionSelection,
      handleSubscriptionSave,
      handleScoreAdd,
      handleCharityUpdate,
      handleLogout,
    ]
  );

  return (
    <AppContext.Provider value={appValue}>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <AppShell>
        <div
          key={token ? "authed" : "anon"}
          className="space-y-6 transition-opacity duration-300 ease-out md:space-y-8"
        >
          {!token ? (
            <PublicNavbar
              darkMode={darkMode}
              onToggleTheme={() => setDarkMode((prev) => !prev)}
              onLogin={handlePublicLogin}
              onRegister={handlePublicRegister}
              onNavigateToHowItWorks={() => scrollToSection("how-it-works")}
              onNavigateToImpact={() => scrollToSection("impact")}
            />
          ) : (
            <PrivateNavbar
              darkMode={darkMode}
              onToggleTheme={() => setDarkMode((prev) => !prev)}
            />
          )}

          <Routes>
            <Route
              path="/"
              element={
                token ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LandingPage
                    mode={mode}
                    setMode={setMode}
                    authForm={authForm}
                    setAuthForm={setAuthForm}
                    charities={charities}
                    loading={loading}
                    handleAuthSubmit={handleAuthSubmit}
                  />
                )
              }
            />
            <Route element={<ProtectedRoute />}>
              <Route element={<PrivateLayout />}>
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="live-draws" element={<LiveDrawsPage />} />
                <Route path="my-rounds" element={<MyRoundsPage />} />
                <Route path="charity-hub" element={<CharityHubPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              <Route
                path="admin"
                element={
                  loading && !user ? (
                    <div className="surface-glass rounded-2xl p-10 text-center text-sm text-neutral-600 dark:text-gray-400">
                      Loading…
                    </div>
                  ) : user?.role === "admin" ? (
                    <section className="space-y-3">
                      <header className="surface-glass rounded-3xl p-5 text-neutral-900 dark:text-[#E5E7EB]">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-green-700 dark:text-[#22C55E]">
                              Admin
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold">Operations Panel</h2>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="rounded-xl border border-[var(--pi-border)] bg-white/70 px-4 py-2 text-sm text-neutral-800 transition-all duration-200 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-[#E5E7EB] dark:hover:bg-white/10"
                          >
                            Back to Dashboard
                          </button>
                        </div>
                      </header>
                      <AdminDashboard
                        token={token}
                        onError={handleAdminError}
                        onSuccess={handleAdminSuccess}
                      />
                    </section>
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                }
              />
            </Route>
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} replace />} />
          </Routes>
        </div>
      </AppShell>
    </AppContext.Provider>
  );
}

export default function App() {
  return <AppRoutes />;
}
