let cartItems =
  JSON.parse(localStorage.getItem("yourTrendCart")) || [];


const itemsBox =
  document.getElementById("checkoutItems");


const totalBox =
  document.getElementById("checkoutTotal");


// ======================================
// Save Cart
// ======================================

function saveCart() {

  localStorage.setItem(
    "yourTrendCart",
    JSON.stringify(cartItems)
  );

}


// ======================================
// Show Checkout
// ======================================

function showCheckout() {

  itemsBox.innerHTML = "";

  let productTotal = 0;


  if (cartItems.length === 0) {

    itemsBox.innerHTML =
      "<p>⚠️ আপনার Cart খালি</p>";

    totalBox.innerText = "0";

    return;

  }


  cartItems.forEach(function(item, index) {


    // পুরোনো Cart হলে quantity 1 ধরা হবে
    if (
      !item.quantity ||
      Number(item.quantity) < 1
    ) {

      item.quantity = 1;

    }


    // পুরোনো product হলে size রাখা হবে
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

  });


  saveCart();

  updateTotal(productTotal);

}


// ======================================
// Increase Quantity
// ======================================

function increaseQuantity(index) {

  cartItems[index].quantity =
    Number(cartItems[index].quantity) + 1;


  saveCart();

  showCheckout();

}


// ======================================
// Decrease Quantity
// ======================================

function decreaseQuantity(index) {

  const currentQuantity =
    Number(cartItems[index].quantity);


  if (currentQuantity > 1) {

    cartItems[index].quantity =
      currentQuantity - 1;

  }


  saveCart();

  showCheckout();

}


// ======================================
// Change Size
// ======================================

function changeSize(index, size) {

  cartItems[index].size = size;


  saveCart();

}


// ======================================
// Update Total
// ======================================

function updateTotal(productTotal) {

  const deliveryCharge =
    Number(
      document.getElementById("deliveryArea").value
    );


  const grandTotal =
    productTotal + deliveryCharge;


  totalBox.innerText =

    "Product: ৳" +
    productTotal +

    " | Delivery: ৳" +
    deliveryCharge +

    " | Total: ৳" +
    grandTotal;

}


// ======================================
// Delivery Charge Change
// ======================================

document
  .getElementById("deliveryArea")
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


      updateTotal(productTotal);

    }
  );


// ======================================
// Place Order
// ======================================

function placeOrder() {


  const name =
    document
      .getElementById("name")
      .value
      .trim();


  const phone =
    document
      .getElementById("phone")
      .value
      .trim();


  const address =
    document
      .getElementById("address")
      .value
      .trim();


  const deliveryCharge =
    Number(
      document
        .getElementById("deliveryArea")
        .value
    );


  const paymentMethod =
    document
      .getElementById("paymentMethod")
      .value;


  const msg =
    document.getElementById("msg");


  // ======================================
  // Validation
  // ======================================

  if (
    !name ||
    !phone ||
    !address
  ) {

    msg.innerText =
      "⚠️ সব তথ্য পূরণ করুন";

    msg.style.color = "red";

    return;

  }


  if (cartItems.length === 0) {

    msg.innerText =
      "⚠️ আপনার Cart খালি";

    msg.style.color = "red";

    return;

  }


  // ======================================
  // Check Size
  // ======================================

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

      msg.style.color = "red";

      return;

    }

  }


  // ======================================
  // Order Number
  // ======================================

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
      .padStart(4, "0");


  // ======================================
  // Product Total
  // ======================================

  let productTotal = 0;


  let orderText =

    "🛍️ YOUR TREND ORDER\n\n" +

    "🧾 Order ID: " +
    orderId +
    "\n\n";


  // ======================================
  // Products
  // ======================================

  cartItems.forEach(
    function(item) {


      const subtotal =
        Number(item.price) *
        Number(item.quantity);


      productTotal += subtotal;


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


  // ======================================
  // Grand Total
  // ======================================

  const grandTotal =
    productTotal +
    deliveryCharge;


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


  // ======================================
  // WhatsApp
  // ======================================

  const whatsappNumber =
    "8801775628710";


  const whatsappURL =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(orderText);


  window.location.href =
    whatsappURL;

}


// ======================================
// Clear Cart
// ======================================

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


// ======================================
// Start
// ======================================

showCheckout();
