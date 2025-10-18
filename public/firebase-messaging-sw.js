/* global importScripts, firebase */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDfZ3fFjUZL4h1JbSA6HqsIN3pc3tAYrIw",
  authDomain: "spainroom-9cb27.firebaseapp.com",
  projectId: "spainroom-9cb27",
  storageBucket: "spainroom-9cb27.firebasestorage.app",
  messagingSenderId: "62528960787",
  appId: "1:62528960787:web:beb81ba1c7af9e9b24c2e6"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification?.title || "SpainRoom",
    { body: payload.notification?.body || "", data: payload.data || {} }
  );
});
