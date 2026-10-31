import { useCallback, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

import { auth, db } from "../../firebase";
import {
  DEFAULT_SETTINGS,
  mergeSettings,
} from "../components/settings-components/settings-tools/settings.constants";

import {
  enablePushNotifications,
  disablePushNotifications,
} from "@/lib/pushNotifications";

export default function useSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notificationBusy, setNotificationBusy] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(() =>
    typeof Notification === "undefined"
      ? "unsupported"
      : Notification.permission,
  );

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [resetBusy, setResetBusy] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(0);

  // Keep the authenticated user synchronized with Firebase.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  // Load the user's saved profile and preferences.
  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      if (!user) {
        setFullName("");
        setUsername("");
        setSettings(DEFAULT_SETTINGS);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const settingsRef = doc(
          db,
          "users",
          user.uid,
          "settings",
          "preferences",
        );

        const profileRef = doc(db, "users", user.uid);

        const [settingsSnapshot, profileSnapshot] = await Promise.all([
          getDoc(settingsRef),
          getDoc(profileRef),
        ]);

        if (cancelled) return;

        const savedSettings = settingsSnapshot.exists()
          ? settingsSnapshot.data()
          : {};

        setSettings(mergeSettings(savedSettings));

        const profileData = profileSnapshot.exists()
          ? profileSnapshot.data()
          : {};

        setFullName(profileData.fullName ?? user.displayName ?? "");

        setUsername(profileData.username ?? "");

        if (typeof Notification !== "undefined") {
          setNotificationPermission(Notification.permission);
        }
      } catch {
        if (!cancelled) {
          toast.error("Unable to load your preferences.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Update an individual preference in local state.
  const updateSetting = useCallback((section, key, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [section]: {
        ...currentSettings[section],
        [key]: value,
      },
    }));
  }, []);

  // Save the profile and ALL preferences, not just appearance.
  const saveSettings = useCallback(async () => {
    if (!user) {
      toast.error("Please sign in to save your preferences.");
      return;
    }

    setSaving(true);

    try {
      const settingsRef = doc(db, "users", user.uid, "settings", "preferences");

      const profileRef = doc(db, "users", user.uid);

      await Promise.all([
        setDoc(settingsRef, settings, { merge: true }),
        setDoc(
          profileRef,
          {
            fullName: fullName.trim(),
            username: username.trim(),
          },
          { merge: true },
        ),
      ]);

      if (user.displayName !== fullName.trim()) {
        await updateProfile(user, {
          displayName: fullName.trim(),
        });
      }

      toast.success("Preferences saved successfully.");
    } catch {
      toast.error("Unable to save your preferences.");
    } finally {
      setSaving(false);
    }
  }, [user, settings, fullName, username]);

  // Send a password reset email and start the cooldown.
  const handlePasswordReset = useCallback(async () => {
    if (!user?.email) {
      toast.error("No email address is associated with this account.");
      return;
    }

    if (resetBusy || resetCooldown > 0) return;

    setResetBusy(true);

    try {
      await sendPasswordResetEmail(auth, user.email);

      setResetCooldown(180);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          toast.error("Your account email address is invalid.");
          break;

        case "auth/user-not-found":
          toast.error("No account was found for this email address.");
          break;

        case "auth/too-many-requests":
          toast.error("Too many attempts. Please try again later.");
          break;

        case "auth/operation-not-allowed":
          toast.error("Password reset is disabled in Firebase Authentication.");
          break;

        case "auth/network-request-failed":
          toast.error("Network error. Check your internet connection.");
          break;

        default:
          toast.error(
            `Password reset failed: ${error.code ?? "unknown-error"}`,
          );
      }
    } finally {
      setResetBusy(false);
    }
  }, [user, resetBusy, resetCooldown]);

  // Decrement the password reset countdown once per second.
  useEffect(() => {
    if (resetCooldown <= 0) return undefined;

    const timer = setTimeout(() => {
      setResetCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [resetCooldown]);

  // Enable or disable push notifications.
  const handlePushToggle = useCallback(
    async (enabled) => {
      if (!user) {
        toast.error("Please sign in to manage notifications.");
        return;
      }

      setNotificationBusy(true);

      try {
        if (enabled) {
          await enablePushNotifications(user);

          if (typeof Notification !== "undefined") {
            setNotificationPermission(Notification.permission);
          }

          toast.success("Push notifications enabled.");
        } else {
          await disablePushNotifications(user);

          if (typeof Notification !== "undefined") {
            setNotificationPermission(Notification.permission);
          }

          toast.success("Push notifications disabled.");
        }

        // Update the preference in local state.
        setSettings((currentSettings) => ({
          ...currentSettings,
          notifications: {
            ...currentSettings.notifications,
            pushEnabled: enabled,
          },
        }));
      } catch {
        toast.error("Unable to update push notifications.");

        if (typeof Notification !== "undefined") {
          setNotificationPermission(Notification.permission);
        }
      } finally {
        setNotificationBusy(false);
      }
    },
    [user],
  );

  // Export all preferences as a JSON file.
  const exportPreferences = useCallback(() => {
    const exportData = {
      profile: {
        fullName,
        username,
        email: user?.email ?? "",
      },
      preferences: settings,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "kwentify-preferences.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    toast.success("Preferences exported.");
  }, [fullName, username, user, settings]);

  return {
    user,
    loading,
    saving,
    notificationBusy,
    notificationPermission,
    fullName,
    setFullName,
    username,
    setUsername,
    settings,
    updateSetting,
    saveSettings,
    handlePasswordReset,
    resetBusy,
    resetCooldown,
    handlePushToggle,
    exportPreferences,
  };
}
