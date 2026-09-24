const product =
  JSON.parse(
    localStorage.getItem("selectedProduct")
  );


if (!product) {

  alert("⚠️ Product পাওয়া যায়নি");

  window.location.href =
    "index.html";

  throw new Error("Product পাওয়া যায়নি");

}


// ======================================
// Product Details
// ======================================

document.getElementById("productImage").src = (product.images?.[0] || product.image);
const gallery = document.getElementById("imageGallery");
gallery.innerHTML = "";

(product.images || [product.image]).forEach(img => {
  gallery.innerHTML += `<img src="${img}" style="width:70px;height:70px;border-radius:8px;object-fit:cover" onclick="document.getElementById('productImage').src='${img}'">`;
});


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


function increaseProductQuantity() {

  const stock =
    Number(product.stock) || 999999;

  if (selectedQuantity >= stock) {

    alert(
      "⚠️ এই Product-এর Stock সীমার বেশি নিতে পারবেন না।"
    );

    return;

  }

  selectedQuantity++;

  document
    .getElementById("productQuantity")
    .innerText =
      selectedQuantity;

}


function decreaseProductQuantity() {

  if (selectedQuantity > 1) {

    selectedQuantity--;

  }

  document
    .getElementById("productQuantity")
    .innerText =
      selectedQuantity;

}


// ======================================
// Get Selected Size
// ======================================

function getSelectedSize() {

  const sizeElement =
    document.getElementById("productSize");

  // Product-এ Size না থাকলে
  if (
    !product.sizes ||
    product.sizes.length === 0
  ) {

    return "প্রযোজ্য নয়";

  }

  return sizeElement.value;

}


// ======================================
// Add Product To Cart
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


  const stock =
    Number(product.stock) || 999999;


  const existing =
    cartItems.find(function(item) {

      return (
        item.name === product.name &&
        item.size === size
      );

    });


  if (existing) {

    if (
      Number(existing.quantity) +
      selectedQuantity >
      stock
    ) {

      alert(
        "⚠️ এই Product-এর Stock সীমার বেশি নিতে পারবেন না।"
      );

      return;

    }


    existing.quantity =
      Number(existing.quantity) +
      selectedQuantity;


  } else {

    cartItems.push({

      name:
        product.name,

      price:
        Number(product.price),

      image: product.images?.[0] || product.image,
images: product.images || [product.image],

      quantity:
        selectedQuantity,

      stock:
        stock,

      size:
        size,

      sizes:
        product.sizes || []

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


  const stock =
    Number(product.stock) || 999999;


  const existing =
    cartItems.find(function(item) {

      return (
        item.name === product.name &&
        item.size === size
      );

    });


  if (existing) {

    if (
      Number(existing.quantity) +
      selectedQuantity >
      stock
    ) {

      alert(
        "⚠️ এই Product-এর Stock সীমার বেশি নিতে পারবেন না।"
      );

      return;

    }


    existing.quantity =
      Number(existing.quantity) +
      selectedQuantity;


  } else {

    cartItems.push({

      name:
        product.name,

      price:
        Number(product.price),

      image: product.images?.[0] || product.image,
images: product.images || [product.image],

      quantity:
        selectedQuantity,

      stock:
        stock,

      size:
        size,

      sizes:
        product.sizes || []

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

const district = document.getElementById("district").value;
const upazila = document.getElementById("upazila").value;
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


  const productTotal =
    Number(product.price) *
    selectedQuantity;


  const grandTotal =
    productTotal +
    deliveryCharge;


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

    "\n🏙️ জেলা: " + district +
"\n📍 উপজেলা: " + upazila +
"\n🏠 ঠিকানা: " + address;


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

const districts = {
  "ঢাকা":["সাভার","ধামরাই","কেরানীগঞ্জ","দোহার","নবাবগঞ্জ"],
  "চট্টগ্রাম":["পটিয়া","সীতাকুণ্ড","রাউজান","হাটহাজারী"],
  "রাজশাহী":["পবা","বাগমারা","চারঘাট"],
  "খুলনা":["ডুমুরিয়া","দাকোপ","রূপসা"],
  "বরিশাল":["গৌরনদী","উজিরপুর","বাকেরগঞ্জ"],
  "সিলেট":["বিয়ানীবাজার","গোয়াইনঘাট","জকিগঞ্জ"],
  "রংপুর":["বদরগঞ্জ","গঙ্গাচড়া","পীরগঞ্জ"],
  "ময়মনসিংহ":["ত্রিশাল","ভালুকা","গফরগাঁও"],
  "পঞ্চগড়":["পঞ্চগড় সদর","বোদা","দেবীগঞ্জ","আটোয়ারী","তেঁতুলিয়া"]
};

const districtSelect = document.getElementById("district");
const upazilaSelect = document.getElementById("upazila");

if (districtSelect && upazilaSelect) {
  Object.keys(districts).sort().forEach(d => {
    districtSelect.innerHTML += `<option value="${d}">${d}</option>`;
  });

  districtSelect.addEventListener("change", () => {
    upazilaSelect.innerHTML = '<option value="">উপজেলা নির্বাচন করুন</option>';
    (districts[districtSelect.value] || []).forEach(u => {
      upazilaSelect.innerHTML += `<option value="${u}">${u}</option>`;
    });
  });
}
