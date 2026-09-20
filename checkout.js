import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* ======================================
   FIREBASE
====================================== */

const firebaseConfig = {

  apiKey: "AIzaSyAfYg-SdoKLFGuEtzFZdqwpqHRRdEuiuQI",

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


/* ======================================
   CART
====================================== */

let cartItems =
  JSON.parse(
    localStorage.getItem("yourTrendCart")
  ) || [];


const itemsBox =
  document.getElementById(
    "checkoutItems"
  );


const totalBox =
  document.getElementById(
    "checkoutTotal"
  );


/* ======================================
   SAVE CART
====================================== */

function saveCart() {

  localStorage.setItem(
    "yourTrendCart",
    JSON.stringify(cartItems)
  );

}


/* ======================================
   SHOW CHECKOUT
====================================== */

function showCheckout() {

  itemsBox.innerHTML = "";

  let productTotal = 0;


  if (cartItems.length === 0) {

    itemsBox.innerHTML =
      "<p>⚠️ আপনার Cart খালি</p>";

    totalBox.innerText = "0";

    return;

  }


  cartItems.forEach(
    function(item, index) {


      /* পুরোনো Cart হলে quantity 1 */

      if (
        !item.quantity ||
        Number(item.quantity) < 1
      ) {

        item.quantity = 1;

      }


      /* পুরোনো Product হলে size */

      if (!item.size) {

        item.size = "";

      }


      const subtotal =
        Number(item.price) *
        Number(item.quantity);


      productTotal += subtotal;


      itemsBox.innerHTML += `

        <div class="checkout-item-box">


          <div class="checkout-product-row">

            <span class="checkout-product-name">

              ${item.name}

            </span>


            <span class="checkout-subtotal">

              ৳${subtotal}

            </span>

          </div>


          <div class="quantity-title">

            🔢 কত পিস নেবেন?

          </div>


          <div class="quantity-control">


            <button
              type="button"
              onclick="decreaseQuantity(${index})"
            >
              −
            </button>


            <span class="quantity-number">

              ${item.quantity}

            </span>


            <button
              type="button"
              onclick="increaseQuantity(${index})"
            >
              +
            </button>


          </div>


          <div class="size-title">

            📏 Size নির্বাচন করুন

          </div>


          <select
            class="size-select"
            onchange="changeSize(${index}, this.value)"
          >

            <option
              value=""
              ${item.size === "" ? "selected" : ""}
            >
              Size নির্বাচন করুন
            </option>


            <option
              value="S"
              ${item.size === "S" ? "selected" : ""}
            >
              S
            </option>


            <option
              value="M"
              ${item.size === "M" ? "selected" : ""}
            >
              M
            </option>


            <option
              value="L"
              ${item.size === "L" ? "selected" : ""}
            >
              L
            </option>


            <option
              value="XL"
              ${item.size === "XL" ? "selected" : ""}
            >
              XL
            </option>


            <option
              value="XXL"
              ${item.size === "XXL" ? "selected" : ""}
            >
              XXL
            </option>


            <option
              value="প্রযোজ্য নয়"
              ${item.size === "প্রযোজ্য নয়" ? "selected" : ""}
            >
              প্রযোজ্য নয়
            </option>


          </select>


        </div>

      `;

    }
  );


  saveCart();

  updateTotal(productTotal);

}


/* ======================================
   INCREASE QUANTITY
====================================== */

function increaseQuantity(index) {

  cartItems[index].quantity =
    Number(
      cartItems[index].quantity
    ) + 1;


  saveCart();

  showCheckout();

}


/* ======================================
   DECREASE QUANTITY
====================================== */

function decreaseQuantity(index) {

  const currentQuantity =
    Number(
      cartItems[index].quantity
    );


  if (currentQuantity > 1) {

    cartItems[index].quantity =
      currentQuantity - 1;

  }


  saveCart();

  showCheckout();

}


/* ======================================
   CHANGE SIZE
====================================== */

function changeSize(
  index,
  size
) {

  cartItems[index].size =
    size;


  saveCart();

}


/* ======================================
   UPDATE TOTAL
====================================== */

function updateTotal(
  productTotal
) {

  const deliveryCharge =
    Number(
      document
        .getElementById(
          "deliveryArea"
        )
        .value
    );


  const grandTotal =
    productTotal +
    deliveryCharge;


  totalBox.innerText =

    "Product: ৳" +
    productTotal +

    " | Delivery: ৳" +
    deliveryCharge +

    " | Total: ৳" +
    grandTotal;

}


/* ======================================
   DELIVERY CHARGE CHANGE
====================================== */

document
  .getElementById(
    "deliveryArea"
  )
  .addEventListener(
    "change",
    function() {


      let productTotal = 0;


      cartItems.forEach(
        function(item) {

          productTotal +=
            Number(item.price) *
            Number(item.quantity);

        }
      );


      updateTotal(
        productTotal
      );

    }
  );


/* ======================================
   PLACE ORDER
====================================== */

async function placeOrder() {


  const name =
    document
      .getElementById(
        "name"
      )
      .value
      .trim();


  const phone =
    document
      .getElementById(
        "phone"
      )
      .value
      .trim();


  const address =
    document
      .getElementById(
        "address"
      )
      .value
      .trim();


  const deliveryCharge =
    Number(
      document
        .getElementById(
          "deliveryArea"
        )
        .value
    );


  const paymentMethod =
    document
      .getElementById(
        "paymentMethod"
      )
      .value;


  const msg =
    document.getElementById(
      "msg"
    );


  /* ======================================
     VALIDATION
  ====================================== */

  if (
    !name ||
    !phone ||
    !address
  ) {

    msg.innerText =
      "⚠️ সব তথ্য পূরণ করুন";

    msg.style.color =
      "red";

    return;

  }


  if (
    cartItems.length === 0
  ) {

    msg.innerText =
      "⚠️ আপনার Cart খালি";

    msg.style.color =
      "red";

    return;

  }


  /* ======================================
     CHECK SIZE
  ====================================== */

  for (
    let i = 0;
    i < cartItems.length;
    i++
  ) {


    if (
      !cartItems[i].size
    ) {

      msg.innerText =
        "⚠️ প্রতিটি Product-এর Size নির্বাচন করুন";

      msg.style.color =
        "red";

      return;

    }

  }


  /* ======================================
     ORDER NUMBER
  ====================================== */

  let orderNumber =
    Number(
      localStorage.getItem(
        "yourTrendOrderNumber"
      )
    ) || 0;


  orderNumber++;


  localStorage.setItem(
    "yourTrendOrderNumber",
    orderNumber
  );


  const orderId =
    "YOURTREND-" +
    String(orderNumber)
      .padStart(
        4,
        "0"
      );
  const trackingToken =
  crypto.randomUUID();


  /* ======================================
     PRODUCT TOTAL
  ====================================== */

  let productTotal = 0;


  /* ======================================
     ORDER ITEMS
  ====================================== */

  const orderItems =
    cartItems.map(
      function(item) {

        const subtotal =
          Number(item.price) *
          Number(item.quantity);


        productTotal +=
          subtotal;


        return {

          name:
            item.name,

          price:
            Number(item.price),

          quantity:
            Number(item.quantity),

          size:
            item.size,

          subtotal:
            subtotal,

          image:
            item.image || ""

        };

      }
    );


  /* ======================================
     GRAND TOTAL
  ====================================== */

  const grandTotal =
    productTotal +
    deliveryCharge;


  /* ======================================
     SAVE ORDER TO FIREBASE
  ====================================== */

  try {

    msg.innerText =
      "⏳ Order Save হচ্ছে...";

    msg.style.color =
      "#ff6b00";


    await addDoc(
      collection(
        db,
        "orders"
      ),
      {

        orderId:
          orderId,
trackingToken: trackingToken,
        customerName:
          name,

        phone:
          phone,

        address:
          address,

        items:
          orderItems,

        productTotal:
          productTotal,

        deliveryCharge:
          deliveryCharge,

        grandTotal:
          grandTotal,

        paymentMethod:
          paymentMethod,

        status:
          "Pending",

        createdAt:
          serverTimestamp()

      }
    );
await setDoc(
  doc(db, "orderTracking", trackingToken),
  {
    orderNumber: orderId,
    status: "Pending"
  }
);

    /* ======================================
       WHATSAPP MESSAGE
    ====================================== */

    let orderText =

      "🛍️ YOUR TREND ORDER\n\n" +

      "🧾 Order ID: " +
      orderId +
      "\n\n";


    cartItems.forEach(
      function(item) {


        const subtotal =
          Number(item.price) *
          Number(item.quantity);


        orderText +=

          "📦 Product: " +
          item.name +

          "\n🔢 Quantity: " +
          item.quantity +

          "\n📏 Size: " +
          item.size +

          "\n💰 Price: ৳" +
          item.price +

          "\n💵 Subtotal: ৳" +
          subtotal +

          "\n\n";

      }
    );


    orderText +=

      "🛍️ Product Total: ৳" +
      productTotal +

      "\n🚚 Delivery Charge: ৳" +
      deliveryCharge +

      "\n💰 Grand Total: ৳" +
      grandTotal +

      "\n💵 Payment: " +
      paymentMethod +

      "\n\n👤 নাম: " +
      name +

      "\n📞 ফোন: " +
      phone +

      "\n📍 ঠিকানা: " +
      address;


    /* ======================================
       WHATSAPP
    ====================================== */

    const whatsappNumber =
      "8801775628710";


    const whatsappURL =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(
        orderText
      );


    msg.innerText =
      "✅ Order Save হয়েছে। WhatsApp খোলা হচ্ছে...";

    msg.style.color =
      "green";


    /* একটু সময় দিয়ে WhatsApp */

    setTimeout(
      function() {

        window.location.href =
          whatsappURL;

      },
      500
    );


  } catch (error) {

    console.error(
      "Order save error:",
      error
    );


    msg.innerText =
      "❌ Order Save হয়নি: " +
      error.message;

    msg.style.color =
      "red";


    /*
      Firebase-এ Save না হলে
      WhatsApp-এ পাঠানো হবে না।
    */

  }

}


/* ======================================
   CLEAR CART
====================================== */

function clearCart() {

  localStorage.removeItem(
    "yourTrendCart"
  );


  cartItems = [];


  showCheckout();


  alert(
    "🗑️ Cart খালি করা হয়েছে"
  );

}


/* ======================================
   START
====================================== */
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.changeSize = changeSize;
window.placeOrder = placeOrder;
window.clearCart = clearCart;

showCheckout();

