import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Tu config
const firebaseConfig = {
  apiKey: "AIzaSyDfZ3fFjUZL4h1JbSA6HqsIN3pc3tAYrIw",
  authDomain: "spainroom-9cb27.firebaseapp.com",
  projectId: "spainroom-9cb27",
  storageBucket: "spainroom-9cb27.firebasestorage.app",
  messagingSenderId: "62528960787",
  appId: "1:62528960787:web:beb81ba1c7af9e9b24c2e6"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Llamar tras login (cuando tengas userId)
export async function registerFcmToken(userId) {
  try {
    const swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
    const perm = await Notification.requestPermission();
    if (perm !== "granted") throw new Error("permiso denegado");
    const token = await getToken(messaging, { serviceWorkerRegistration: swReg /*, vapidKey: "TU_VAPID_PUBLIC_KEY"*/ });
    await fetch(`${import.meta.env.VITE_API_BASE}/api/push/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, fcm_token: token, platform: "web" })
    });
    return token;
  } catch (e) { console.error("FCM register error", e); return null; }
}

export function bindForegroundHandler(onPayload) {
  onMessage(messaging, (payload) => onPayload?.(payload));
}
