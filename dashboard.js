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
/* =========================
   LOAD TODAY ORDERS
========================= */

async function loadDashboardOrders() {

  const orderCounter =
    document.getElementById("totalOrders");

  if (!orderCounter) {
    return;
  }

  try {

    const snapshot =
      await getDocs(
        collection(db, "orders")
      );

    let todayOrders = 0;

    const today = new Date();

    snapshot.forEach(function(orderDoc) {

      const order = orderDoc.data();

      if (
        order.createdAt &&
        typeof order.createdAt.toDate === "function"
      ) {

        const orderDate =
          order.createdAt.toDate();

        if (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        ) {

          todayOrders++;

        }

      }

    });

    orderCounter.innerText =
      todayOrders;

  } catch (error) {

    console.error(
      "Dashboard Order Error:",
      error
    );

    orderCounter.innerText = "—";

  }

}


loadDashboardOrders();
/* =========================
   LOAD TODAY SALES
========================= */

async function loadDashboardSales() {

  const salesCounter =
    document.getElementById("totalSales");

  if (!salesCounter) {
    return;
  }

  try {

    const snapshot =
      await getDocs(
        collection(db, "orders")
      );

    let todaySales = 0;

    const today = new Date();

    snapshot.forEach(function(orderDoc) {

      const order = orderDoc.data();

      if (
        order.createdAt &&
        typeof order.createdAt.toDate === "function"
      ) {

        const orderDate =
          order.createdAt.toDate();

        if (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        ) {

          todaySales += Number(order.total) || 0;

        }

      }

    });

    salesCounter.innerText =
      "৳" + todaySales;

  } catch (error) {

    console.error(
      "Dashboard Sales Error:",
      error
    );

    salesCounter.innerText = "—";

  }

}


loadDashboardSales();
