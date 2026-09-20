const product =
  JSON.parse(
    localStorage.getItem("selectedProduct")
  );


if (!product) {

  alert("⚠️ Product পাওয়া যায়নি");

  window.location.href =
    "index.html";

}


// ======================================
// Product Details
// ======================================

document
  .getElementById("productImage")
  .src = product.image;


document
  .getElementById("productName")
  .innerText = product.name;


document
  .getElementById("productPrice")
  .innerText = product.price;


document
  .getElementById("productDescription")
  .innerText = product.description;


// ======================================
// Product Quantity
// ======================================

let selectedQuantity = 1;


// Increase

function increaseProductQuantity() {

  selectedQuantity++;

  document
    .getElementById("productQuantity")
    .innerText = selectedQuantity;

}


// Decrease

function decreaseProductQuantity() {

  if (selectedQuantity > 1) {

    selectedQuantity--;

  }


  document
    .getElementById("productQuantity")
    .innerText = selectedQuantity;

}


// ======================================
// Get Selected Size
// ======================================

function getSelectedSize() {

  return document
    .getElementById("productSize")
    .value;

}


// ======================================
// Add to Cart
// ======================================

function addSelectedProduct() {


  const size =
    getSelectedSize();


  if (!size) {

    alert(
      "⚠️ অনুগ্রহ করে Product-এর Size নির্বাচন করুন"
    );

    return;

  }


  let cartItems =
    JSON.parse(
      localStorage.getItem("yourTrendCart")
    ) || [];


  const existing =
    cartItems.find(function(item) {

      return (
        item.name === product.name &&
        item.size === size
      );

    });


  if (existing) {

    existing.quantity +=
      selectedQuantity;

  } else {

    cartItems.push({

      name: product.name,

      price: product.price,

      image: product.image,

      quantity: selectedQuantity,

      size: size

    });

  }


  localStorage.setItem(
    "yourTrendCart",
    JSON.stringify(cartItems)
  );


  alert(
    "✅ Product Cart-এ যোগ হয়েছে"
  );

}


// ======================================
// Checkout
// ======================================

function goCheckout() {


  const size =
    getSelectedSize();


  if (!size) {

    alert(
      "⚠️ অনুগ্রহ করে Product-এর Size নির্বাচন করুন"
    );

    return;

  }


  let cartItems =
    JSON.parse(
      localStorage.getItem("yourTrendCart")
    ) || [];


  const existing =
    cartItems.find(function(item) {

      return (
        item.name === product.name &&
        item.size === size
      );

    });


  if (existing) {

    existing.quantity +=
      selectedQuantity;

  } else {

    cartItems.push({

      name: product.name,

      price: product.price,

      image: product.image,

      quantity: selectedQuantity,

      size: size

    });

  }


  localStorage.setItem(
    "yourTrendCart",
    JSON.stringify(cartItems)
  );


  window.location.href =
    "checkout.html";

}


// ======================================
// Direct WhatsApp Order
// ======================================

function orderSelectedProduct() {


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


  const size =
    getSelectedSize();


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
      "⚠️ নাম, ফোন ও ঠিকানা পূরণ করুন";

    msg.style.color =
      "red";

    return;

  }


  if (!size) {

    msg.innerText =
      "⚠️ Product-এর Size নির্বাচন করুন";

    msg.style.color =
      "red";

    return;

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

  const productTotal =
    Number(product.price) *
    selectedQuantity;


  const grandTotal =
    productTotal +
    deliveryCharge;


  // ======================================
  // WhatsApp Message
  // ======================================

  const orderText =

    "🛍️ YOUR TREND ORDER\n\n" +

    "🧾 Order ID: " +
    orderId +

    "\n\n" +

    "📦 Product: " +
    product.name +

    "\n🔢 Quantity: " +
    selectedQuantity +

    "\n📏 Size: " +
    size +

    "\n💰 Price: ৳" +
    product.price +

    "\n💵 Subtotal: ৳" +
    productTotal +

    "\n\n" +

    "🛍️ Product Total: ৳" +
    productTotal +

    "\n🚚 Delivery Charge: ৳" +
    deliveryCharge +

    "\n💰 Grand Total: ৳" +
    grandTotal +

    "\n💵 Payment: Cash on Delivery" +

    "\n\n👤 নাম: " +
    name +

    "\n📞 ফোন: " +
    phone +

    "\n📍 ঠিকানা: " +
    address;


  // ======================================
  // WhatsApp Number
  // ======================================

  const whatsappNumber =
    "8801775628710";


  const whatsappURL =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(
      orderText
    );


  window.location.href =
    whatsappURL;

    }
