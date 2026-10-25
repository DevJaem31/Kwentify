import {
  getMessaging,
  getToken,
  deleteToken,
  isSupported,
} from "firebase/messaging";

import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

import { app, db } from "../../firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export async function enablePushNotifications(user) {
  if (!user) {
    throw new Error("Please sign in first.");
  }

  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    throw new Error("Your browser does not support push notifications.");
  }

  if (!(await isSupported())) {
    throw new Error("Firebase messaging is not supported in this browser.");
  }

  if (!VAPID_KEY) {
    throw new Error("Firebase VAPID key is not configured.");
  }

  let permission = Notification.permission;

  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  const messaging = getMessaging(app);

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("Unable to register this browser for notifications.");
  }

  await setDoc(doc(db, "users", user.uid, "pushTokens", token), {
    token,
    platform: "web",
    updatedAt: serverTimestamp(),
  });

  return { token, messaging };
}

export async function disablePushNotifications(user) {
  if (!user) {
    throw new Error("Please sign in first.");
  }

  if (!(await isSupported())) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration(
    "/firebase-messaging-sw.js",
  );

  const messaging = getMessaging(app);

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    ...(registration ? { serviceWorkerRegistration: registration } : {}),
  });

  if (token) {
    await deleteDoc(doc(db, "users", user.uid, "pushTokens", token));
  }

  await deleteToken(messaging);
}
