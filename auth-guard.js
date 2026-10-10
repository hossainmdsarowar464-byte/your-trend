/* YOUR TREND — OPTIONAL AUTH GUARD
   Include this module only on pages that must require a signed-in customer.
   Product browsing remains public; actions are gated by auth-ui.js.
*/
import {
  initializeApp, getApps, getApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged
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

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

function redirectToLogin() {
  const returnTo = window.location.pathname + window.location.search + window.location.hash;
  sessionStorage.setItem("yourTrendNextPage", returnTo);
  const loginUrl = new URL("customer.html", window.location.href);
  loginUrl.searchParams.set("returnTo", returnTo);
  window.location.replace(loginUrl.href);
}

onAuthStateChanged(auth, user => {
  if (!user) redirectToLogin();
});
