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

const auth = getAuth(app);


/* =========================================
   GET TODAY - BANGLADESH
========================================= */

function getTodayBangladesh() {

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(new Date());

}


/* =========================================
   GET ORDER DATE
========================================= */

function getOrderDate(order) {

  try {

    if (
      order &&
      order.createdAt &&
      typeof order.createdAt.toDate === "function"
    ) {

      return order.createdAt.toDate();

    }


    if (
      order &&
      order.createdAt instanceof Date
    ) {

      return order.createdAt;

    }


    if (
      order &&
      typeof order.createdAt === "string"
    ) {

      const date =
        new Date(order.createdAt);

      if (!isNaN(date.getTime())) {

        return date;

      }

    }

  } catch (error) {

    console.error(
      "Get order date error:",
      error
    );

  }


  return null;

}


/* =========================================
   CHECK TODAY
========================================= */

function isToday(date) {

  if (!date) {
    return false;
  }

  try {

    const dateString =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone: "Asia/Dhaka",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }
      ).format(date);


    return (
      dateString ===
      getTodayBangladesh()
    );

  } catch (error) {

    console.error(
      "Today check error:",
      error
    );

    return false;

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
        collection(db, "products")
      );


    counter.innerText =
      snapshot.size;


    console.log(
      "Products:",
      snapshot.size
    );

  } catch (error) {

    console.error(
      "Products Error:",
      error
    );

    counter.innerText =
      "ERROR";

  }

}


/* =========================================
   LOAD ORDERS
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
        collection(db, "orders")
      );


    let todayOrders = 0;

    let todaySales = 0;

    let totalSales = 0;

    const orders = [];


    /* =====================================
       READ ALL ORDERS
    ===================================== */

    snapshot.forEach(function(orderDoc) {

      const order =
        orderDoc.data();


      const fullOrder = {

        id: orderDoc.id,

        ...order

      };


      orders.push(fullOrder);


      /* ORDER TOTAL */

      const orderTotal =
        Number(
          order.grandTotal ??
          order.total ??
          0
        );


      /* ALL TIME SALES */

      totalSales +=
        orderTotal;


      /* TODAY */

      const orderDate =
        getOrderDate(order);


      if (
        orderDate &&
        isToday(orderDate)
      ) {

        todayOrders++;

        todaySales +=
          orderTotal;

      }

    });


    /* =====================================
       UPDATE TODAY ORDERS
    ===================================== */

    if (todayOrdersCounter) {

      todayOrdersCounter.innerText =
        todayOrders;

    }


    /* =====================================
       UPDATE TODAY SALES
    ===================================== */

    if (todaySalesCounter) {

      todaySalesCounter.innerText =
        "৳" +
        todaySales.toLocaleString(
          "en-US"
        );

    }


    /* =====================================
       UPDATE TOTAL ORDERS
    ===================================== */

    if (totalOrdersCounter) {

      totalOrdersCounter.innerText =
        snapshot.size;

    }


    /* =====================================
       UPDATE TOTAL SALES
    ===================================== */

    if (totalSalesCounter) {

      totalSalesCounter.innerText =
        "৳" +
        totalSales.toLocaleString(
          "en-US"
        );

    }


    /* =====================================
       RECENT ORDERS
    ===================================== */

    loadRecentOrders(
      orders
    );


    console.log(
      "Total Orders:",
      snapshot.size
    );

    console.log(
      "Today's Orders:",
      todayOrders
    );

    console.log(
      "Today's Sales:",
      todaySales
    );

    console.log(
      "Total Sales:",
      totalSales
    );


  } catch (error) {

    console.error(
      "Orders Error:",
      error
    );


    /*
      শুধু যেটা সত্যিই error হয়েছে
      সেটাই ERROR দেখাবে
    */

    if (todayOrdersCounter) {

      todayOrdersCounter.innerText =
        "ERROR";

    }

    if (todaySalesCounter) {

      todaySalesCounter.innerText =
        "ERROR";

    }

    if (totalOrdersCounter) {

      totalOrdersCounter.innerText =
        "ERROR";

    }

    if (totalSalesCounter) {

      totalSalesCounter.innerText =
        "ERROR";

    }

  }

}


/* =========================================
   RECENT ORDERS
========================================= */

function loadRecentOrders(orders) {

  const box =
    document.getElementById(
      "recentOrders"
    );


  if (!box) {
    return;
  }


  try {

    orders.sort(
      function(a, b) {

        const dateA =
          getOrderDate(a) ||
          new Date(0);

        const dateB =
          getOrderDate(b) ||
          new Date(0);


        return dateB - dateA;

      }
    );


    const recentOrders =
      orders.slice(0, 5);


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
          order.id ||
          "N/A";


        const customerName =
          order.customerName ||
          order.name ||
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

          try {

            orderTime =
              orderDate.toLocaleString(
                "bn-BD",
                {
                  dateStyle:
                    "medium",

                  timeStyle:
                    "short"
                }
              );

          } catch (error) {

            console.error(
              "Order time error:",
              error
            );

          }

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

  } catch (error) {

    console.error(
      "Recent Orders Error:",
      error
    );

  }

}


/* =========================================
   LOAD TODAY VISITORS
========================================= */

async function loadVisitors() {

  const counter =
    document.getElementById(
      "totalVisitors"
    );


  if (!counter) {
    return;
  }


  try {

    const snapshot =
      await getDocs(
        collection(db, "visits")
      );


    let visitors = 0;


    const today =
      getTodayBangladesh();


    snapshot.forEach(
      function(visitDoc) {

        const visit =
          visitDoc.data();


        /* DATE FIELD */

        if (
          visit.date &&
          String(visit.date) ===
          String(today)
        ) {

          visitors++;

          return;

        }


        /* LAST VISIT */

        if (
          visit.lastVisit &&
          typeof visit.lastVisit.toDate ===
          "function"
        ) {

          const visitDate =
            visit.lastVisit.toDate();


          const visitDay =
            new Intl.DateTimeFormat(
              "en-CA",
              {
                timeZone:
                  "Asia/Dhaka",

                year:
                  "numeric",

                month:
                  "2-digit",

                day:
                  "2-digit"
              }
            ).format(
              visitDate
            );


          if (
            visitDay ===
            today
          ) {

            visitors++;

          }

        }

      }
    );


    counter.innerText =
      visitors;


    console.log(
      "YOUR TREND Visitors:",
      visitors
    );


  } catch (error) {

    console.error(
      "Visitors Error:",
      error
    );


    counter.innerText =
      "ERROR";

  }

}


/* =========================================
   START DASHBOARD
========================================= */

onAuthStateChanged(
  auth,
  async function(user) {

    console.log(
      "AUTH CHECK:",
      user
    );


    if (!user) {

      console.log(
        "❌ Admin login নেই"
      );

      return;

    }


    console.log(
      "✅ Admin logged in:",
      user.email
    );


    try {

      await loadProducts();

      await loadVisitors();

      await loadOrders();


      console.log(
        "✅ Dashboard data loaded successfully"
      );

    } catch (error) {

      console.error(
        "❌ Dashboard loading error:",
        error
      );

    }

  }
);
