/* YOUR TREND — SHARED CUSTOMER AUTH UI
   Public pages stay viewable. Cart, checkout and ordering require login.
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
let currentUser = null;
let authResolved = false;
let resolveAuthReady;
const authReady = new Promise(resolve => { resolveAuthReady = resolve; });

function currentPageTarget() {
  return window.location.pathname + window.location.search + window.location.hash;
}

function loginUrlForCurrentPage() {
  const returnTo = currentPageTarget();
  const url = new URL("customer.html", window.location.href);
  url.searchParams.set("returnTo", returnTo);
  return url.href;
}

window.ytRequireCustomer = async function () {
  await authReady;
  if (currentUser) return true;
  sessionStorage.setItem("yourTrendNextPage", currentPageTarget());
  window.location.assign(loginUrlForCurrentPage());
  return false;
};

function injectStyles() {
  if (document.getElementById("ytAuthUiStyles")) return;
  const style = document.createElement("style");
  style.id = "ytAuthUiStyles";
  style.textContent = `
    .yt-auth-cta {
      display:inline-flex; align-items:center; justify-content:center;
      min-height:36px; padding:0 13px; border-radius:999px;
      color:#fff !important; text-decoration:none !important;
      font:700 12px/1.1 Arial,sans-serif; white-space:nowrap;
      background:linear-gradient(135deg,#0f172a,#2563eb);
      border:1px solid rgba(255,255,255,.35);
      box-shadow:0 5px 14px rgba(37,99,235,.2);
      position:relative; z-index:2;
    }
    .yt-auth-cta[hidden] { display:none !important; }
    .yt-auth-cta:active { transform:scale(.98); }
    .yourTrendHeader .yt-auth-cta { margin-left:6px; flex:0 0 auto; }
    .product-header,.checkout-header { position:relative; }
    .product-header .yt-auth-cta,.checkout-header .yt-auth-cta {
      position:absolute; right:12px; top:12px; min-height:32px;
      padding:0 10px; font-size:11px;
    }
    @media(max-width:380px) {
      .yourTrendHeader .yt-auth-cta { padding:0 8px; font-size:10px; }
    }
  `;
  document.head.appendChild(style);
}

function createAuthButton() {
  if (document.querySelector(".yt-auth-cta")) return;
  let host = null;
  let pageHeader = false;

  const storefrontHeader = document.querySelector(".yourTrendHeader .headerTop");
  if (storefrontHeader) {
    host = storefrontHeader;
    const cart = storefrontHeader.querySelector(".cart");
    const anchor = document.createElement("a");
    anchor.className = "yt-auth-cta";
    anchor.textContent = "Log in / Sign up";
    anchor.href = loginUrlForCurrentPage();
    anchor.setAttribute("aria-label", "Log in or create a YOUR TREND account");
    if (cart) storefrontHeader.insertBefore(anchor, cart);
    else storefrontHeader.appendChild(anchor);
    return;
  }

  const header = document.querySelector(".product-header, .checkout-header");
  if (header) {
    pageHeader = true;
    const anchor = document.createElement("a");
    anchor.className = "yt-auth-cta";
    anchor.textContent = "Log in";
    anchor.href = loginUrlForCurrentPage();
    anchor.setAttribute("aria-label", "Log in or create a YOUR TREND account");
    header.appendChild(anchor);
  }
}

function refreshAuthUi(user) {
  currentUser = user || null;
  injectStyles();
  createAuthButton();

  // The single premium login CTA is replaced by account access after login.
  document.querySelectorAll(".yt-auth-cta").forEach(button => {
    if (currentUser) {
      button.hidden = true;
      button.style.display = "none";
      button.setAttribute("aria-hidden", "true");
    } else {
      button.hidden = false;
      button.style.display = "inline-flex";
      button.removeAttribute("aria-hidden");
      button.href = loginUrlForCurrentPage();
    }
  });

  // The old menu button duplicated the new single CTA. Account remains reachable
  // through the site's Account navigation after login.
  document.querySelectorAll(".account-btn").forEach(button => {
    button.style.display = "none";
  });

  if (!authResolved) {
    authResolved = true;
    resolveAuthReady(currentUser);
  }
}

onAuthStateChanged(auth, refreshAuthUi);
