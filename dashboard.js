import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {

  apiKey:
    "AIzaSyAfYg-SdoKLFGuEtzFZdqwpqHRRdEuiuQI",

  authDomain:
    "your-trend.firebaseapp.com",

  projectId:
    "your-trend",

  storageBucket:
    "your-trend.firebasestorage.app",

  messagingSenderId:
    "775017944976",

  appId:
    "1:775017944976:web:a19b34b89e6a4285148515",

  measurementId:
    "G-1T4GM19268"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


/* =========================
   LOAD TOTAL PRODUCTS
========================= */

async function loadDashboardProducts() {

  const productCounter =
    document.getElementById("totalProducts");

  if (!productCounter) {
    return;
  }

  try {

    const snapshot =
      await getDocs(
        collection(db, "products")
      );

    productCounter.innerText =
      snapshot.size;

  } catch (error) {

    console.error(
      "Dashboard Product Error:",
      error
    );

    productCounter.innerText = "—";

  }

}


/* =========================
   START DASHBOARD
========================= */

loadDashboardProducts();
