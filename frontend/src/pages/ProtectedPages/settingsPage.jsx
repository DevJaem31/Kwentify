import { useState } from "react";
import { Check } from "lucide-react";

import useSettings from "../../hooks/useSettings";
import SettingsHeader from "../../components/settings-components/SettingsHeader";
import SettingsSidebar from "../../components/settings-components/SettingsSidebar";
import ProfileSection from "../../components/settings-components/ProfileSection";
import AppearanceSection from "../../components/settings-components/AppearanceSection";
import RegionalSection from "../../components/settings-components/RegionalSection";
import NotificationsSection from "../../components/settings-components/NotificationsSection";
import SecuritySection from "../../components/settings-components/SecuritySection";
import DataManagementSection from "../../components/settings-components/DataManagementSection";
import SettingsSkeleton from "../../components/settings-components/SettingsSkeleton";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  const {
    user,
    loading,
    saving,
    notificationBusy,
    notificationPermission,
    fullName,
    setFullName,
    username,
    settings,
    updateSetting,
    saveSettings,
    handlePasswordReset,
    handlePushToggle,
    exportPreferences,
    resetBusy,
    resetCooldown,
  } = useSettings();
  const { setTheme } = useTheme();

  function handleThemeChange(theme) {
    updateSetting("appearance", "theme", theme);
    setTheme(theme);
  }

  function scrollToSection(id) {
    setActiveSection(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <SettingsSkeleton />
      </main>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-10">
      <div className="mb-6 sm:mb-8">
        <SettingsHeader saving={saving} onSave={saveSettings} />
      </div>

      <div className="grid min-w-0 grid-cols-1 items-start gap-5 sm:gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <aside className="min-w-0 lg:sticky lg:top-6">
          <SettingsSidebar
            user={user}
            fullName={fullName}
            activeSection={activeSection}
            onNavigate={scrollToSection}
          />
        </aside>

        <div className="min-w-0 space-y-5 sm:space-y-6 lg:space-y-8">
          <section id="profile" className="min-w-0 scroll-mt-20">
            <ProfileSection
              user={user}
              fullName={fullName}
              setFullName={setFullName}
              username={username}
            />
          </section>

          <section id="appearance" className="min-w-0 scroll-mt-20">
            <AppearanceSection
              theme={settings.appearance.theme}
              onThemeChange={handleThemeChange}
            />
          </section>

          <section id="regional" className="min-w-0 scroll-mt-20">
            <RegionalSection
              regional={settings.regional}
              onChange={(key, value) => updateSetting("regional", key, value)}
            />
          </section>

          <section id="notifications" className="min-w-0 scroll-mt-20">
            <NotificationsSection
              notifications={settings.notifications}
              onChange={(key, value) =>
                updateSetting("notifications", key, value)
              }
              notificationBusy={notificationBusy}
              notificationPermission={notificationPermission}
              onPushToggle={handlePushToggle}
            />
          </section>

          <section id="security" className="min-w-0 scroll-mt-20">
            <SecuritySection
              onPasswordReset={handlePasswordReset}
              resetBusy={resetBusy}
              resetCooldown={resetCooldown}
            />
          </section>

          <section id="data-management" className="min-w-0 scroll-mt-20">
            <DataManagementSection onExport={exportPreferences} />
          </section>

          <footer className="flex min-w-0 flex-col-reverse gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your preferences are saved to your Kwentify account.
            </p>

            <Button
              onClick={saveSettings}
              disabled={saving}
              className="w-full shrink-0 rounded-xl sm:w-auto"
            >
              <Check className="mr-2 size-4" />
              {saving ? "Saving changes..." : "Save changes"}
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
}
