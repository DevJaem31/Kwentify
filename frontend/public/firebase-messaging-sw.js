/* global firebase, importScripts */

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBZm2GKaFLjJmjT7QzljLNdLoTd6_aennY",
  authDomain: "kwentify-51160.firebaseapp.com",
  projectId: "kwentify-51160",
  storageBucket: "kwentify-51160.firebasestorage.app",
  messagingSenderId: "719390239744",
  appId: "1:719390239744:web:2d4e53836ce173ba153ce5",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Kwentify reminder";

  const options = {
    body: payload.notification?.body || "You have a new financial reminder.",
    icon: "/favicon.ico",
    data: {
      url: payload.fcmOptions?.link || "/dashboard",
    },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/dashboard",
    self.location.origin,
  );

  if (targetUrl.origin !== self.location.origin) return;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            client.navigate(targetUrl.href);
            return client.focus();
          }
        }

        return self.clients.openWindow(targetUrl.href);
      }),
  );
});
