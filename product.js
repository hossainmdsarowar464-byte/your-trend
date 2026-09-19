
const product =
  JSON.parse(
    localStorage.getItem("selectedProduct")
  );

if (!product) {

  alert("⚠️ Product পাওয়া যায়নি");

  window.location.href = "index.html";

}


// Product Details

document.getElementById("productImage").src =
  product.image;

document.getElementById("productName").innerText =
  product.name;

document.getElementById("productPrice").innerText =
  product.price;

document.getElementById("productDescription").innerText =
  product.description;


// Add to Cart

function addSelectedProduct() {

  let cartItems =
    JSON.parse(
      localStorage.getItem("yourTrendCart")
    ) || [];

  const existing =
    cartItems.find(function(item) {
      return item.name === product.name;
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

  localStorage.setItem(
    "yourTrendCart",
    JSON.stringify(cartItems)
  );

  alert("✅ Product Cart-এ যোগ হয়েছে");
}


// Checkout

function goCheckout() {

  let cartItems =
    JSON.parse(
      localStorage.getItem("yourTrendCart")
    ) || [];

  if (cartItems.length === 0) {

    addSelectedProduct();

  }

  window.location.href =
    "checkout.html";
}


// WhatsApp Order

function orderSelectedProduct() {

  const name =
    document.getElementById("name").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const address =
    document.getElementById("address").value.trim();

  const deliveryCharge =
    Number(
      document.getElementById("deliveryArea").value
    );

  const msg =
    document.getElementById("msg");


  if (!name || !phone || !address) {

    msg.innerText =
      "⚠️ নাম, ফোন ও ঠিকানা পূরণ করুন";

    return;

  }


  // Order Number

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
    String(orderNumber).padStart(4, "0");


  const productTotal =
    product.price;


  const grandTotal =
    productTotal +
    deliveryCharge;


  // WhatsApp Message

  const orderText =

    "🛍️ YOUR TREND ORDER\n\n" +

    "🧾 Order ID: " +
    orderId +

    "\n\n" +

    "📦 Product: " +
    product.name +

    " × 1 = ৳" +
    product.price +

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


  // YOUR TREND WhatsApp Number

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
