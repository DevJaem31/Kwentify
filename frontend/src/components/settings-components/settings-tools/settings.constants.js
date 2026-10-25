import {
  Bell,
  Globe,
  Palette,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";

export const DEFAULT_SETTINGS = {
  appearance: {
    theme: "system",
  },
  regional: {
    currency: "PHP",
    dateFormat: "MMM d, yyyy",
    timezone: "Asia/Manila",
  },
  notifications: {
    pushEnabled: false,
    billReminders: true,
    budgetAlerts: true,
    savingsMilestones: true,
  },
};

export const NAV_ITEMS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "regional", label: "Regional preferences", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "data", label: "Data management", icon: Wallet },
];

export function mergeSettings(saved = {}) {
  return {
    appearance: {
      ...DEFAULT_SETTINGS.appearance,
      ...saved.appearance,
    },
    regional: {
      ...DEFAULT_SETTINGS.regional,
      ...saved.regional,
    },
    notifications: {
      ...DEFAULT_SETTINGS.notifications,
      ...saved.notifications,
    },
  };
}
