import { UserRound, Mail, Shield, Sparkles } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { useApp } from "../context/AppContext";

function ProfilePage() {
  const { user, subscription, showToast } = useApp();

  return (
    <div className="space-y-6">
      <header className="surface-glass rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-green-800 dark:text-[#22C55E]">Profile</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-[#E5E7EB] md:text-3xl">
          Account & membership
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-gray-400">
          Manage how you appear in the app. Password and billing integrations can connect here when backend
          endpoints are ready.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-green-600/25 bg-green-50 text-green-800 dark:border-green-500/20 dark:bg-green-500/10 dark:text-[#22C55E]">
              <UserRound className="h-8 w-8" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-neutral-800 dark:text-[#E5E7EB]">
                {user?.name || "Member"}
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-neutral-600 dark:text-[#9CA3AF]">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {user?.email || "—"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="active">{(subscription?.plan || "monthly").toUpperCase()}</Badge>
                {user?.role === "admin" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200/55 bg-neutral-100/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-[#9CA3AF]">
                    <Shield className="h-3 w-3" aria-hidden />
                    Admin
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-neutral-600 dark:text-[#9CA3AF]">
            Member ID is derived from your account record. Export and data requests will be supported in a
            future compliance release.
          </p>
        </Card>

        <Card className="p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-green-800 dark:text-[#22C55E]" aria-hidden />
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-[#E5E7EB]">Preferences</h3>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-500 dark:text-[#9CA3AF]">
                Display name
              </label>
              <Input className="mt-1.5" defaultValue={user?.name || ""} readOnly aria-readonly />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-500 dark:text-[#9CA3AF]">
                Email
              </label>
              <Input className="mt-1.5" type="email" defaultValue={user?.email || ""} readOnly aria-readonly />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                variant="primary"
                onClick={() => showToast("Profile save will sync when PATCH /me is wired.", "info")}
              >
                Save changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => showToast("Password reset flow will open here.", "info")}
              >
                Change password
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
