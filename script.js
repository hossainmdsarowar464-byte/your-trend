let list = [
  {
    name: "Premium T-Shirt",
    price: 490,
    image: "images/1779024969_L_11.jpeg",
    category: "fashion",
    description: "Premium quality comfortable T-Shirt. দৈনন্দিন ব্যবহার ও casual wear-এর জন্য উপযোগী।",
    stock: 10,
    sizes: ["S", "M", "L", "XL"]
  },

  {
    name: "Smart Watch",
    price: 890,
    image: "images/1789826533436.png",
    category: "gadgets",
    description: "Stylish Smart Watch with modern design. দৈনন্দিন ব্যবহার ও lifestyle-এর জন্য উপযোগী।",
    stock: 10,
    sizes: []
  },

  {
    name: "Earbuds",
    price: 690,
    image: "images/1789826573511.png",
    category: "gadgets",
    description: "Compact wireless Earbuds with stylish design. Music ও daily use-এর জন্য উপযোগী।",
    stock: 10,
    sizes: []
  },

  {
    name: "Travel Bag",
    price: 790,
    image: "images/1789826597035.png",
    category: "bags",
    description: "Durable এবং spacious Travel Bag. ভ্রমণ ও দৈনন্দিন ব্যবহারের জন্য উপযোগী।",
    stock: 10,
    sizes: []
  }
];


const box =
  document.getElementById("products");


const searchInput =
  document.getElementById("search");


let cartItems =
  JSON.parse(
    localStorage.getItem("yourTrendCart")
  ) || [];


// =========================
// SEARCH
// =========================

searchInput.addEventListener(
  "input",
  function () {

    const keyword =
      searchInput.value
        .toLowerCase()
        .trim();


    const results =
      list.filter(function (p) {

        return p.name
          .toLowerCase()
          .includes(keyword);

      });


    showProducts(results);

  }
);


// =========================
// SHOW PRODUCTS
// =========================

function showProducts(products) {

  box.innerHTML = "";


  products.forEach(function (p) {

    const stock =
      Number(p.stock) || 0;


    let stockHTML = "";


    let buttonHTML = "";


    if (stock > 0) {

      stockHTML = `
        <p style="color:green;font-weight:bold;">
          📦 Stock: ${stock}
        </p>
      `;


      buttonHTML = `
        <button
          class="btn"
          onclick="event.stopPropagation(); addCart('${p.name}')"
        >
          🛒 Add to Cart
        </button>
      `;

    } else {

      stockHTML = `
        <p style="color:red;font-weight:bold;">
          ❌ Out of Stock
        </p>
      `;


      buttonHTML = `
        <button
          class="btn"
          disabled
          style="
            background:#999;
            cursor:not-allowed;
          "
        >
          ❌ Out of Stock
        </button>
      `;

    }


    box.innerHTML += `

      <div
        class="card"
        onclick="openProduct('${p.name}')"
      >
<span class="product-badge">
  ${
    p.category === "fashion"
      ? "👕 FASHION"
      : p.category === "gadgets"
      ? "⌚ GADGETS"
      : p.category === "bags"
      ? "🎒 BAGS"
      : "✨ PRODUCT"
  }
</span>
        <img
          class="img"
          src="${p.image}"
          alt="${p.name}"
          onclick="event.stopPropagation(); viewImage('${p.image}')"
          style="cursor:zoom-in;"
        >


        <h3>
          ${p.name}
        </h3>


        <p>
          <b>৳${p.price}</b>
        </p>


        ${stockHTML}


        ${buttonHTML}

      </div>

    `;

  });

}


// =========================
// FIREBASE PRODUCTS
// =========================

async function loadFirebaseProducts() {

  try {

    const {
      initializeApp
    } =
      await import(
        "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"
      );


    const {
      getFirestore,
      collection,
      getDocs
    } =
      await import(
        "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
      );


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
      initializeApp(
        firebaseConfig
      );


    const db =
      getFirestore(app);


    const snapshot =
      await getDocs(
        collection(
          db,
          "products"
        )
      );


    list = [];


    snapshot.forEach(
      function(productDoc) {

        const product =
          productDoc.data();


        list.push({
  name: product.name,
  price: product.price,
  image: product.images?.[0] || product.image,
  images: product.images || [product.image],
  category: product.category,
  description: product.description,
  stock: Number(product.stock) || 0,
  sizes: product.sizes || []
});

      }
    );


    showProducts(list);


  } catch (error) {

    console.error(
      "Firebase products error:",
      error
    );

  }

}

loadFirebaseProducts();


// =========================
// VIEW IMAGE
// =========================

function viewImage(image) {

  window.open(
    image,
    "_blank"
  );

}


// =========================
// CATEGORY
// =========================

function filterCategory(category) {

  if (category === "all") {

    showProducts(list);

    return;

  }


  const results =
    list.filter(
      function (p) {

        return p.category ===
          category;

      }
    );


  showProducts(results);

}


// =========================
// ADD CART
// =========================

function addCart(productName) {

  const product =
    list.find(
      function (p) {

        return p.name ===
          productName;

      }
    );


  if (!product) return;


  const stock =
    Number(product.stock) || 0;


  // Stock check

  if (stock <= 0) {

    alert(
      "❌ এই Product বর্তমানে Out of Stock"
    );

    return;

  }


  const existing =
    cartItems.find(
      function (item) {

        return item.name ===
          productName;

      }
    );


  if (existing) {

    // Stock limit

    if (
      existing.quantity >=
      stock
    ) {

      alert(
        "⚠️ এই Product-এর যতগুলো Stock আছে তার বেশি নিতে পারবেন না।"
      );

      return;

    }


    existing.quantity++;

  } else {

    cartItems.push({

      name:
        product.name,

      price:
        product.price,

      image:
        product.image,

      quantity:
        1,

      stock:
        stock,

      sizes:
        product.sizes || []

    });

  }


  updateCart();

}


// =========================
// UPDATE CART
// =========================

function updateCart() {

  localStorage.setItem(

    "yourTrendCart",

    JSON.stringify(
      cartItems
    )

  );


  let count = 0;

  let total = 0;


  cartItems.forEach(
    function (item) {

      count +=
        item.quantity;


      total +=
        item.price *
        item.quantity;

    }
  );


  const countBox =
    document.getElementById(
      "count"
    );


  if (countBox) {

    countBox.innerText =
      count;

  }


  const totalBox =
    document.getElementById(
      "total"
    );


  if (totalBox) {

    totalBox.innerText =
      total;

  }

}


// =========================
// SHOW CART ITEMS
// =========================

function showCartItems() {

  const cartBox =
    document.getElementById(
      "cartItems"
    );


  if (!cartBox) return;


  cartBox.innerHTML = "";


  if (
    cartItems.length === 0
  ) {

    cartBox.innerHTML =
      "<p>Cart এখন খালি</p>";

    return;

  }


  cartItems.forEach(
    function (
      item,
      index
    ) {

      cartBox.innerHTML += `

        <div
          style="
            border-bottom:1px solid #ddd;
            padding:10px 0;
          "
        >

          <b>
            ${item.name}
          </b>

          <p>
            ৳${item.price}
            × ${item.quantity}
          </p>


          <button
            onclick="decreaseItem(${index})"
          >
            −
          </button>


          <span
            style="margin:0 10px;"
          >
            ${item.quantity}
          </span>


          <button
            onclick="increaseItem(${index})"
          >
            +
          </button>


          <button
            onclick="removeItem(${index})"
            style="margin-left:10px;"
          >
            ❌
          </button>

        </div>

      `;

    }
  );

}


// =========================
// INCREASE
// =========================

function increaseItem(index) {

  const item =
    cartItems[index];


  if (!item) return;


  const stock =
    Number(item.stock) || 0;


  if (
    item.quantity >=
    stock
  ) {

    alert(
      "⚠️ Stock সীমার বেশি নেওয়া যাবে না।"
    );

    return;

  }


  item.quantity++;


  updateCart();

}


// =========================
// DECREASE
// =========================

function decreaseItem(index) {

  cartItems[index].quantity--;


  if (
    cartItems[index].quantity <=
    0
  ) {

    cartItems.splice(
      index,
      1
    );

  }


  updateCart();

}


// =========================
// REMOVE
// =========================

function removeItem(index) {

  cartItems.splice(
    index,
    1
  );


  updateCart();

}


// =========================
// OPEN CART
// =========================

function openCart() {

  if (
    cartItems.length === 0
  ) {

    alert(
      "⚠️ আগে Cart-এ Product যোগ করুন"
    );

    return;

  }


  window.location.href =
    "checkout.html";

}


// =========================
// CLOSE CART
// =========================

function closeCart() {

  const cartBox =
    document.getElementById(
      "cartBox"
    );


  if (cartBox) {

    cartBox.style.display =
      "none";

  }

}


// =========================
// CHECKOUT
// =========================

function goCheckout() {

  if (
    cartItems.length === 0
  ) {

    alert(
      "⚠️ আগে Cart-এ Product যোগ করুন"
    );

    return;

  }


  window.location.href =
    "checkout.html";

}


// =========================
// CHECKOUT SUMMARY
// =========================

function showCheckoutSummary() {

  const itemsBox =
    document.getElementById(
      "checkoutItems"
    );


  const totalBox =
    document.getElementById(
      "checkoutTotal"
    );


  if (
    !itemsBox ||
    !totalBox
  ) return;


  itemsBox.innerHTML = "";


  let total = 0;


  cartItems.forEach(
    function (item) {

      const subtotal =
        item.price *
        item.quantity;


      total +=
        subtotal;


      itemsBox.innerHTML += `

        <div
          class="summary-item"
        >

          <span>

            ${item.name}
            × ${item.quantity}

          </span>


          <b>

            ৳${subtotal}

          </b>

        </div>

      `;

    }
  );


  const deliveryElement =
    document.getElementById(
      "deliveryArea"
    );


  if (!deliveryElement)
    return;


  const deliveryCharge =
    Number(
      deliveryElement.value
    );


  const grandTotal =
    total +
    deliveryCharge;


  totalBox.innerText =
    "Product: ৳" +
    total +
    " | Delivery: ৳" +
    deliveryCharge +
    " | Total: ৳" +
    grandTotal;

}


// =========================
// PLACE ORDER
// =========================

function placeOrder() {

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


  if (
    !name ||
    !phone ||
    !address
  ) {

    msg.innerText =
      "⚠️ সব তথ্য পূরণ করুন";

    return;

  }


  if (
    cartItems.length === 0
  ) {

    msg.innerText =
      "⚠️ আপনার Cart খালি";

    return;

  }


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
    String(
      orderNumber
    ).padStart(
      4,
      "0"
    );


  let productTotal =
    0;


  let orderText =

    "🛍️ YOUR TREND ORDER\n\n" +

    "🧾 Order ID: " +
    orderId +
    "\n\n";


  cartItems.forEach(
    function (item) {

      const subtotal =
        item.price *
        item.quantity;


      productTotal +=
        subtotal;


      orderText +=

        "📦 " +
        item.name +
        " × " +
        item.quantity +
        " = ৳" +
        subtotal +
        "\n";

    }
  );


  const grandTotal =
    productTotal +
    deliveryCharge;


  orderText +=

    "\n🛍️ Product Total: ৳" +
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


  const whatsappNumber =
    "8801775628710";


  const whatsappURL =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(
      orderText
    );


  window.open(
    whatsappURL,
    "_blank"
  );


  msg.innerText =
    "✅ WhatsApp-এ Order পাঠানো হচ্ছে...";

}


// =========================
// OPEN PRODUCT
// =========================

function openProduct(
  productName
) {

  const product =
    list.find(
      function (p) {

        return p.name ===
          productName;

      }
    );


  if (!product) return;


  localStorage.setItem(
    "selectedProduct",
    JSON.stringify(
      product
    )
  );


  window.location.href =
    "product.html";

}


// =========================
// INITIAL DISPLAY
// =========================

showProducts(list);
/* =========================
   TRACK ORDER
========================= */

const trackOrderBtn =
  document.getElementById(
    "trackOrderBtn"
  );


if (trackOrderBtn) {

  trackOrderBtn.addEventListener(
    "click",
    async function() {

      const orderId =
        document
          .getElementById(
            "trackOrderId"
          )
          .value
          .trim();


      const result =
        document.getElementById(
          "trackOrderResult"
        );


      if (!orderId) {

        result.innerHTML = `
          <div style="
            padding:15px;
            background:#ffebee;
            border-radius:10px;
            color:#d32f2f;
            font-weight:bold;
          ">
            ⚠️ আপনার Order ID লিখুন।
          </div>
        `;

        return;

      }


      result.innerHTML = `
        <p>
          ⏳ Order খোঁজা হচ্ছে...
        </p>
      `;


      try {

        const {
          getApp
        } =
          await import(
            "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"
          );


        const {
          getFirestore,
          doc,
          getDoc
        } =
          await import(
            "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
          );


        const db =
          getFirestore(
            getApp()
          );


        const trackingRef =
          doc(
            db,
            "orderTracking",
            orderId
          );


        const trackingSnap =
          await getDoc(
            trackingRef
          );


        if (!trackingSnap.exists()) {

          result.innerHTML = `
            <div style="
              padding:15px;
              background:#ffebee;
              border-radius:10px;
              color:#d32f2f;
              font-weight:bold;
            ">
              ❌ এই Order ID পাওয়া যায়নি।
            </div>
          `;

          return;

        }


        const tracking =
          trackingSnap.data();


        const status =
          tracking.status ||
          "Pending";


        let statusEmoji =
          "🟡";


        if (
          status === "Confirmed"
        ) {

          statusEmoji =
            "🟢";

        }


        if (
          status === "Shipped"
        ) {

          statusEmoji =
            "🚚";

        }


        if (
          status === "Delivered"
        ) {

          statusEmoji =
            "✅";

        }


        if (
          status === "Cancelled"
        ) {

          statusEmoji =
            "❌";

        }


        result.innerHTML = `

          <div style="
            padding:18px;
            margin-top:15px;
            background:#f8f8f8;
            border:1px solid #ddd;
            border-radius:12px;
            text-align:left;
          ">

            <h3 style="
              margin-top:0;
            ">
              🧾 Order Found
            </h3>


            <p>
              <b>📋 Order ID:</b>
              ${
                tracking.orderNumber ||
                orderId
              }
            </p>


            <div style="
              margin-top:15px;
              padding:15px;
              background:white;
              border-radius:10px;
              text-align:center;
            ">

              <div style="
                font-size:28px;
              ">
                ${statusEmoji}
              </div>


              <div style="
                margin-top:8px;
                font-size:20px;
                font-weight:bold;
              ">
                ${status}
              </div>

            </div>

          </div>

        `;


      } catch (error) {

        console.error(
          "Track Order Error:",
          error
        );


        result.innerHTML = `
          <div style="
            padding:15px;
            background:#ffebee;
            border-radius:10px;
            color:#d32f2f;
          ">
            ❌ Order খুঁজতে সমস্যা হয়েছে।
          </div>
        `;

      }

    }
  );

}
