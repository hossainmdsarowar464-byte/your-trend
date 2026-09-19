const list = [
  {
    name: "Premium T-Shirt",
    price: 490,
    image: "1779024969_L_9.jpeg",
    category: "fashion"
  },
  {
    name: "Smart Watch",
    price: 890,
    image: "1779024969_L_9.jpeg",
    category: "gadgets"
  },
  {
    name: "Earbuds",
    price: 690,
    image: "1779024969_L_9.jpeg",
    category: "gadgets"
  },
  {
    name: "Travel Bag",
    price: 790,
    image: "1779024969_L_9.jpeg",
    category: "bags"
  }
];

const box = document.getElementById("products");
const searchInput = document.getElementById("search");

let cartItems =
  JSON.parse(localStorage.getItem("yourTrendCart")) || [];


/* =========================
   PRODUCTS
========================= */

function showProducts(products) {
  box.innerHTML = "";

  products.forEach(function (p) {
    box.innerHTML += `
      <div class="card">
        <img
          class="img"
          src="${p.image}"
          alt="${p.name}"
        >

        <h3>${p.name}</h3>

        <p>
          <b>৳${p.price}</b>
        </p>

        <button
          class="btn"
          onclick="addCart('${p.name}')"
        >
          Add to Cart
        </button>
      </div>
    `;
  });
}

showProducts(list);


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


  showCartItems();
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

  document.getElementById(
    "cartBox"
  ).style.display = "block";

  showCartItems();
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


  closeCart();

  showCheckoutSummary();


  document
    .querySelector(".checkout")
    .scrollIntoView({
      behavior: "smooth"
    });
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
  const msg = document.getElementById("msg");

  const deliveryCharge =
    Number(document.getElementById("deliveryArea").value);

  if (!name || !phone || !address) {
    msg.innerText = "⚠️ সব তথ্য পূরণ করুন";
    return;
  }

  if (cartItems.length === 0) {
    msg.innerText = "⚠️ আগে Cart-এ Product যোগ করুন";
    return;
  }

  let productTotal = 0;

  let orderText =
    "🛍️ YOUR TREND ORDER\n\n";

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

  const grandTotal =
    productTotal + deliveryCharge;

  orderText +=
    "\n🛍️ Product Total: ৳" +
    productTotal +
    "\n🚚 Delivery Charge: ৳" +
    deliveryCharge +
    "\n💰 Grand Total: ৳" +
    grandTotal +
    "\n\n👤 নাম: " +
    name +
    "\n📞 ফোন: " +
    phone +
    "\n📍 ঠিকানা: " +
    address;

  const whatsappNumber = "8801775628710";

  const whatsappURL =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(orderText);

  window.open(whatsappURL, "_blank");

  msg.innerText =
    "✅ WhatsApp-এ Order পাঠানো হচ্ছে...";
}
