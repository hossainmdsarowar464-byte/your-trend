import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =========================================
   FIREBASE
========================================= */

const firebaseConfig = {

  apiKey:
    "AIzaSyAfYg-SdoKLFGuEtzFzdqwpqHRRdEuiuQI",

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


const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);
const auth = getAuth(app);

/* =========================================
   DATE HELPERS
========================================= */

function getTodayDate() {

  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(now.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(now.getDate())
      .padStart(2, "0");

  return year + "-" + month + "-" + day;

}


function getOrderDate(order) {

  if (
    order.createdAt &&
    typeof order.createdAt.toDate === "function"
  ) {

    return order.createdAt.toDate();

  }

  return null;

}


function isToday(date) {

  if (!date) {
    return false;
  }

  const now =
    new Date();

  return (

    date.getDate() ===
      now.getDate()

    &&

    date.getMonth() ===
      now.getMonth()

    &&

    date.getFullYear() ===
      now.getFullYear()

  );

}


/* =========================================
   ADD EXTRA SUMMARY CARDS
========================================= */

function createExtraCards() {

  const cards =
    document.querySelector(
      ".dashboard-cards"
    );

  if (!cards) {
    return;
  }


  /* Total Orders */

  if (
    !document.getElementById(
      "totalAllOrders"
    )
  ) {

    cards.insertAdjacentHTML(
      "beforeend",

      `
      <div class="card">
        <span>Total Orders</span>
        <strong id="totalAllOrders">0</strong>
        <small>All time</small>
      </div>
      `

    );

  }


  /* Total Sales */

  if (
    !document.getElementById(
      "totalAllSales"
    )
  ) {

    cards.insertAdjacentHTML(
      "beforeend",

      `
      <div class="card">
        <span>Total Sales</span>
        <strong id="totalAllSales">৳0</strong>
        <small>All time</small>
      </div>
      `

    );

  }

}


/* =========================================
   LOAD PRODUCTS
========================================= */

async function loadProducts() {

  const counter =
    document.getElementById(
      "totalProducts"
    );

  if (!counter) {
    return;
  }


  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "products"
        )
      );


    counter.innerText =
      snapshot.size;


  } catch (error) {

    console.error(
      "Products Error:",
      error
    );

    counter.innerText =
      "—";

  }

}


/* =========================================
   LOAD ALL ORDERS
========================================= */

async function loadOrders() {

  const todayOrdersCounter =
    document.getElementById(
      "totalOrders"
    );

  const todaySalesCounter =
    document.getElementById(
      "totalSales"
    );

  const totalOrdersCounter =
    document.getElementById(
      "totalAllOrders"
    );

  const totalSalesCounter =
    document.getElementById(
      "totalAllSales"
    );


  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "orders"
        )
      );


    let todayOrders = 0;

    let todaySales = 0;

    let totalSales = 0;


    const orders = [];


    snapshot.forEach(
      function(orderDoc) {

        const order =
          orderDoc.data();


        orders.push({

          id:
            orderDoc.id,

          ...order

        });


        /* =========================
           ORDER DATE
        ========================= */

        const orderDate =
          getOrderDate(order);


        /* =========================
           ORDER TOTAL
        ========================= */

        const orderTotal =
          Number(
            order.grandTotal ??
            order.total ??
            0
          );


        /* =========================
           TOTAL SALES
        ========================= */

        totalSales +=
          orderTotal;


        /* =========================
           TODAY
        ========================= */

        if (
          isToday(orderDate)
        ) {

          todayOrders++;

          todaySales +=
            orderTotal;

        }

      }
    );


    /* =========================
       SHOW COUNTS
    ========================= */

    if (todayOrdersCounter) {

      todayOrdersCounter.innerText =
        todayOrders;

    }


    if (todaySalesCounter) {

      todaySalesCounter.innerText =
        "৳" +
        todaySales.toLocaleString(
          "en-US"
        );

    }


    if (totalOrdersCounter) {

      totalOrdersCounter.innerText =
        snapshot.size;

    }


    if (totalSalesCounter) {

      totalSalesCounter.innerText =
        "৳" +
        totalSales.toLocaleString(
          "en-US"
        );

    }


    /* =========================
       RECENT ORDERS
    ========================= */

    loadRecentOrders(
      orders
    );


  } catch (error) {

    console.error(
      "Orders Error:",
      error
    );


    if (todayOrdersCounter) {
      todayOrdersCounter.innerText =
        "—";
    }


    if (todaySalesCounter) {
      todaySalesCounter.innerText =
        "—";
    }


    if (totalOrdersCounter) {
      totalOrdersCounter.innerText =
        "—";
    }


    if (totalSalesCounter) {
      totalSalesCounter.innerText =
        "—";
    }

  }

}


/* =========================================
   RECENT ORDERS
========================================= */

function loadRecentOrders(
  orders
) {

  const box =
    document.getElementById(
      "recentOrders"
    );


  if (!box) {
    return;
  }


  /* =========================
     SORT NEWEST FIRST
  ========================= */

  orders.sort(
    function(a, b) {

      const dateA =
        getOrderDate(a) ||
        new Date(0);

      const dateB =
        getOrderDate(b) ||
        new Date(0);


      return (
        dateB - dateA
      );

    }
  );


  const recentOrders =
    orders.slice(0, 5);


  /* =========================
     NO ORDERS
  ========================= */

  if (
    recentOrders.length === 0
  ) {

    box.innerHTML = `

      <p class="empty-message">
        No orders yet.
      </p>

    `;

    return;

  }


  box.innerHTML = "";


  /* =========================
     SHOW ORDERS
  ========================= */

  recentOrders.forEach(
    function(order) {

      const orderBox =
        document.createElement(
          "div"
        );


      orderBox.style.padding =
        "14px 0";

      orderBox.style.borderBottom =
        "1px solid #e2e8f0";


      const orderNumber =
        order.orderId ||
        order.orderNumber ||
        order.id;


      const customerName =
        order.customerName ||
        "Customer";


      const total =
        Number(
          order.grandTotal ??
          order.total ??
          0
        );


      let orderTime =
        "সময় পাওয়া যায়নি";


      const orderDate =
        getOrderDate(order);


      if (orderDate) {

        orderTime =
          orderDate.toLocaleString(
            "bn-BD",
            {
              dateStyle: "medium",
              timeStyle: "short"
            }
          );

      }


      orderBox.innerHTML = `

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
        ">

          <strong style="
            font-size:15px;
            color:#0f172a;
          ">

            #${orderNumber}

          </strong>


          <strong style="
            font-size:15px;
            color:#2563eb;
            white-space:nowrap;
          ">

            ৳${total.toLocaleString("en-US")}

          </strong>

        </div>


        <div style="
          margin-top:6px;
          color:#475569;
          font-size:14px;
        ">

          ${customerName}

        </div>


        <div style="
          margin-top:4px;
          color:#94a3b8;
          font-size:12px;
        ">

          ${orderTime}

        </div>

      `;


      box.appendChild(
        orderBox
      );

    }
  );

}
/* =========================================
   LOAD TODAY VISITORS
========================================= */

async function loadVisitors() {

  const counter =
    document.getElementById("totalVisitors");

  if (!counter) {
    return;
  }

  try {

    const snapshot =
      await getDocs(
        collection(db, "visits")
      );

    let visitors = 0;

    /* Bangladesh-এর আজকের তারিখ */

    const today =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone: "Asia/Dhaka",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }
      ).format(new Date());


    snapshot.forEach(function(visitDoc) {

      const visit =
        visitDoc.data();


      /* Visitor-এর saved date */

      if (
        visit.date &&
        String(visit.date) ===
        String(today)
      ) {

        visitors++;

        return;

      }


      /* Date না মিললে lastVisit timestamp দিয়ে পরীক্ষা */

      if (
        visit.lastVisit &&
        typeof visit.lastVisit.toDate === "function"
      ) {

        const visitDate =
          visit.lastVisit.toDate();


        const visitDay =
          new Intl.DateTimeFormat(
            "en-CA",
            {
              timeZone: "Asia/Dhaka",
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            }
          ).format(visitDate);


        if (
          visitDay === today
        ) {

          visitors++;

        }

      }

    });


    counter.innerText =
      visitors;


    console.log(
      "YOUR TREND Visitors:",
      visitors,
      "Today:",
      today
    );


  } catch (error) {

    console.error(
      "Visitors Error:",
      error
    );

    counter.innerText =
      "—";

  }

}


/* =========================================
   START DASHBOARD
========================================= */

createExtraCards();
loadProducts();
loadVisitors();

onAuthStateChanged(auth, function(user) {
  if (user) {
    loadOrders();
  }
});

