import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDfZ3fFjUZL4h1JbSA6HqsIN3pc3tAYrIw",
  authDomain: "spainroom-9cb27.firebaseapp.com",
  projectId: "spainroom-9cb27",
  storageBucket: "spainroom-9cb27.firebasestorage.app",
  messagingSenderId: "62528960787",
  appId: "1:62528960787:web:beb81ba1c7af9e9b24c2e6",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function askFcmToken(userId = "USR-TEST") {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BJ9qH7-cz2aafbWeuwUYNQ0vEfGanCH0Wfel1ZuJkcEzz_z5MKq5R6AzRnLRJgh0-RzISE0XRV39TiNJYQyT0g4",
    });

    if (!token) {
      alert("No se pudo obtener token (¿HTTPS habilitado?)");
      return;
    }

    console.log("🔹 TOKEN FCM =", token);

    // Registrar token en backend
    const res = await fetch("https://backend-spainroom.onrender.com/api/push/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, fcm_token: token, platform: "web" }),
    });

    const data = await res.json();
    console.log("✅ Registro backend:", data);
    alert("Token FCM registrado correctamente ✅");
  } catch (err) {
    console.error("❌ Error al registrar push:", err);
  }
}
