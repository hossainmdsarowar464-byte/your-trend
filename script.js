
const list = [
  {
    name: "Premium T-Shirt",
    price: 490,
    image: "images/1779024969_L_11.jpeg",
    category: "fashion",
    description: "Premium quality comfortable T-Shirt. দৈনন্দিন ব্যবহার ও casual wear-এর জন্য উপযোগী।"
  },

  {
    name: "Smart Watch",
    price: 890,
    image: "1779024969_L_9.jpeg",
    category: "gadgets",
    description: "Stylish Smart Watch with modern design. দৈনন্দিন ব্যবহার ও lifestyle-এর জন্য উপযোগী।"
  },

  {
    name: "Earbuds",
    price: 690,
    image: "1779024969_L_9.jpeg",
    category: "gadgets",
    description: "Compact wireless Earbuds with stylish design. Music ও daily use-এর জন্য উপযোগী।"
  },

  {
    name: "Travel Bag",
    price: 790,
    image: "1779024969_L_9.jpeg",
    category: "bags",
    description: "Durable এবং spacious Travel Bag. ভ্রমণ ও দৈনন্দিন ব্যবহারের জন্য উপযোগী।"
  }
];
const box = document.getElementById("products");
const searchInput = document.getElementById("search");

let cartItems =
  JSON.parse(localStorage.getItem("yourTrendCart")) || [];


/* =========================
   PRODUCTS
========================= */




/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", function () {

  const keyword =
    searchInput.value.toLowerCase().trim();

  const results = list.filter(function (p) {

    return p.name
      .toLowerCase()
      .includes(keyword);

  });

  showProducts(results);
});

function showProducts(products) {

  box.innerHTML = "";

  products.forEach(function (p) {

    box.innerHTML += `

      <div
        class="card"
        onclick="openProduct('${p.name}')"
      >

        <img
          class="img"
          src="${p.image}"
          alt="${p.name}"
          onclick="event.stopPropagation(); viewImage('${p.image}')"
          style="cursor: zoom-in;"
        >

        <h3>${p.name}</h3>

        <p>
          <b>৳${p.price}</b>
        </p>

        <button
          class="btn"
          onclick="event.stopPropagation(); addCart('${p.name}')"
        >
          Add to Cart
        </button>

      </div>

    `;

  });
}

showProducts(list);


function viewImage(image) {

  window.open(image, "_blank");

}
/* =========================
   CATEGORY
========================= */

function filterCategory(category) {

  if (category === "all") {
    showProducts(list);
    return;
  }

  const results = list.filter(function (p) {

    return p.category === category;

  });

  showProducts(results);
}


/* =========================
   ADD CART
========================= */

function addCart(productName) {

  const product = list.find(function (p) {

    return p.name === productName;

  });

  if (!product) return;


  const existing = cartItems.find(function (item) {

    return item.name === productName;

  });


  if (existing) {

    existing.quantity++;

  } else {

    cartItems.push({
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });

  }

  updateCart();
}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

  localStorage.setItem(
    "yourTrendCart",
    JSON.stringify(cartItems)
  );


  let count = 0;
  let total = 0;


  cartItems.forEach(function (item) {

    count += item.quantity;

    total +=
      item.price * item.quantity;

  });


  document.getElementById("count").innerText =
    count;

  document.getElementById("total").innerText =
    total;



}


/* =========================
   SHOW CART
========================= */

function showCartItems() {

  const cartBox =
    document.getElementById("cartItems");

  cartBox.innerHTML = "";


  if (cartItems.length === 0) {

    cartBox.innerHTML =
      "<p>Cart এখন খালি</p>";

    return;
  }


  cartItems.forEach(function (item, index) {

    cartBox.innerHTML += `

      <div
        style="
          border-bottom:1px solid #ddd;
          padding:10px 0;
        "
      >

        <b>${item.name}</b>

        <p>
          ৳${item.price} × ${item.quantity}
        </p>


        <button
          onclick="decreaseItem(${index})"
        >
          −
        </button>


        <span style="margin:0 10px;">
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

  });
}


/* =========================
   INCREASE
========================= */

function increaseItem(index) {

  cartItems[index].quantity++;

  updateCart();
}


/* =========================
   DECREASE
========================= */

function decreaseItem(index) {

  cartItems[index].quantity--;


  if (cartItems[index].quantity <= 0) {

    cartItems.splice(index, 1);

  }


  updateCart();
}


/* =========================
   REMOVE
========================= */

function removeItem(index) {

  cartItems.splice(index, 1);

  updateCart();
}


/* =========================
   OPEN CART
========================= */

function openCart() {

  if (cartItems.length === 0) {

    alert("⚠️ আগে Cart-এ Product যোগ করুন");

    return;
  }

  window.location.href = "checkout.html";

}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

  document.getElementById(
    "cartBox"
  ).style.display = "none";
}


/* =========================
   CHECKOUT
========================= */

function goCheckout() {

  if (cartItems.length === 0) {

    alert(
      "⚠️ আগে Cart-এ Product যোগ করুন"
    );

    return;
  }

  window.location.href = "checkout.html";

}


/* =========================
   CHECKOUT SUMMARY
========================= */

function showCheckoutSummary() {

  const itemsBox =
    document.getElementById(
      "checkoutItems"
    );

  const totalBox =
    document.getElementById(
      "checkoutTotal"
    );


  itemsBox.innerHTML = "";


  let total = 0;


  cartItems.forEach(function (item) {

    const subtotal =
      item.price * item.quantity;

    total += subtotal;


    itemsBox.innerHTML += `

      <div class="summary-item">

        <span>
          ${item.name}
          × ${item.quantity}
        </span>

        <b>
          ৳${subtotal}
        </b>

      </div>

    `;

  });


  const deliveryCharge =
  Number(document.getElementById("deliveryArea").value);

const grandTotal =
  total + deliveryCharge;

totalBox.innerText =
  "Product: ৳" + total +
  " | Delivery: ৳" + deliveryCharge +
  " | Total: ৳" + grandTotal;
}


/* =========================
   PLACE ORDER
========================= */
function placeOrder() {

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  const deliveryCharge =
    Number(document.getElementById("deliveryArea").value);

  const paymentMethod =
    document.getElementById("paymentMethod").value;

  const msg = document.getElementById("msg");

  if (!name || !phone || !address) {
    msg.innerText = "⚠️ সব তথ্য পূরণ করুন";
    return;
  }

  if (cartItems.length === 0) {
    msg.innerText = "⚠️ আগে Cart-এ Product যোগ করুন";
    return;
  }

  /* Order ID */

  let orderNumber =
    Number(localStorage.getItem("yourTrendOrderNumber")) || 0;

  orderNumber++;

  localStorage.setItem(
    "yourTrendOrderNumber",
    orderNumber
  );

  const orderId =
    "YOURTREND-" +
    String(orderNumber).padStart(4, "0");


  /* Product Total */

  let productTotal = 0;

  let orderText =
    "🛍️ YOUR TREND ORDER\n\n" +
    "🧾 Order ID: " +
    orderId +
    "\n\n";


  cartItems.forEach(function(item) {

    const subtotal =
      item.price * item.quantity;

    productTotal += subtotal;

    orderText +=
      "📦 " +
      item.name +
      " × " +
      item.quantity +
      " = ৳" +
      subtotal +
      "\n";
  });


  /* Grand Total */

  const grandTotal =
    productTotal + deliveryCharge;


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


  /* WhatsApp */

  const whatsappNumber =
    "8801775628710";

  const whatsappURL =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(orderText);
  


  window.open(
    whatsappURL,
    "_blank"
  );


  msg.innerText =
    "✅ WhatsApp-এ Order পাঠানো হচ্ছে...";
}
function openProduct(productName) {

  const product = list.find(function (p) {

    return p.name === productName;

  });

  if (!product) return;

  localStorage.setItem(
    "selectedProduct",
    JSON.stringify(product)
  );

  window.location.href = "product.html";

}
