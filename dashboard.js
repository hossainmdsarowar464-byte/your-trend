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
/* =========================
   LOAD TODAY VISITORS
========================= */

async function loadTodayVisitors() {

  const visitorCounter =
    document.getElementById("totalVisitors");

  if (!visitorCounter) {
    return;
  }

  try {

    const snapshot =
      await getDocs(
        collection(db, "visits")
      );

    let todayVisitors = 0;

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    snapshot.forEach(function(visitDoc) {

      const visit =
        visitDoc.data();

      if (visit.date === today) {
        todayVisitors++;
      }

    });

    visitorCounter.innerText =
      todayVisitors;

  } catch (error) {

    console.error(
      "Dashboard Visitor Error:",
      error
    );

    visitorCounter.innerText = "—";

  }

}


loadTodayVisitors();
/* =========================
   LOAD RECENT ORDERS
========================= */

async function loadRecentOrders() {

  const ordersBox =
    document.getElementById("recentOrders");

  if (!ordersBox) {
    return;
  }

  try {

    const snapshot =
      await getDocs(
        collection(db, "orders")
      );

    const orders = [];

    snapshot.forEach(function(orderDoc) {

      const order = orderDoc.data();

      orders.push({
        id: orderDoc.id,
        ...order
      });

    });

    orders.sort(function(a, b) {

      const dateA =
        a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(0);

      const dateB =
        b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(0);

      return dateB - dateA;

    });


    const recentOrders =
      orders.slice(0, 5);


    if (recentOrders.length === 0) {

      ordersBox.innerHTML =
        '<p class="empty-message">No orders yet.</p>';

      return;

    }


    ordersBox.innerHTML = "";


    recentOrders.forEach(function(order) {

      let orderTime =
        "সময় পাওয়া যায়নি";


      if (
        order.createdAt &&
        typeof order.createdAt.toDate === "function"
      ) {

        orderTime =
          order.createdAt
            .toDate()
            .toLocaleString("bn-BD");

      }


      const orderItem =
        document.createElement("div");


      orderItem.style.padding =
        "12px 0";

      orderItem.style.borderBottom =
        "1px solid #e2e8f0";


      orderItem.innerHTML = `

        <strong>
          #${order.orderNumber || order.id}
        </strong>

        <div style="
          margin-top:5px;
          color:#475569;
          font-size:14px;
        ">

          ${order.customerName || "Customer"}

          · ৳${order.total || 0}

        </div>

        <div style="
          margin-top:4px;
          color:#94a3b8;
          font-size:
