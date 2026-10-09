/* YOUR TREND — CUSTOMER LOGIN GUARD */

import {
  initializeApp,
  getApps,
  getApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfYg-SdoKLFGuEtzFZdqwpqHRRdEuiuQI",
  authDomain: "your-trend.firebaseapp.com",
  projectId: "your-trend",
  storageBucket: "your-trend.firebasestorage.app",
  messagingSenderId: "775017944976",
  appId: "1:775017944976:web:a19b34b89e6a4285148515",
  measurementId: "G-1T4GM19268"
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const auth = getAuth(app);

onAuthStateChanged(auth, function (user) {
  if (!user) {
    const nextPage =
      location.pathname + location.search + location.hash;

    sessionStorage.setItem("yourTrendNextPage", nextPage);
    location.replace("customer.html");
  }
});
