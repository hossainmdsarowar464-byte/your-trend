let cartItems =
  JSON.parse(localStorage.getItem("yourTrendCart")) || [];


const itemsBox =
  document.getElementById("checkoutItems");

const totalBox =
  document.getElementById("checkoutTotal");


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

    const subtotal =
      item.price * item.quantity;

    productTotal += subtotal;


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


  updateTotal(productTotal);
}



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



document
  .getElementById("deliveryArea")
  .addEventListener("change", function() {

    let productTotal = 0;


    cartItems.forEach(function(item) {

      productTotal +=
        item.price * item.quantity;

    });


    updateTotal(productTotal);

  });



function placeOrder() {

  const name =
    document.getElementById("name")
      .value.trim();


  const phone =
    document.getElementById("phone")
      .value.trim();


  const address =
    document.getElementById("address")
      .value.trim();


  const deliveryCharge =
    Number(
      document.getElementById("deliveryArea").value
    );


  const paymentMethod =
    document.getElementById("paymentMethod").value;


  const msg =
    document.getElementById("msg");


  if (!name || !phone || !address) {

    msg.innerText =
      "⚠️ সব তথ্য পূরণ করুন";

    return;

  }


  if (cartItems.length === 0) {

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
    String(orderNumber).padStart(4, "0");


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



showCheckout();
