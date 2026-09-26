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


const firebaseConfig = {

  apiKey: "AIzaSyAfYg-SdoKLFGuEtzFzdqwpqHRRdEuiuQI",

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
const params = new URLSearchParams(window.location.search);
const productName = params.get("id");

let product = JSON.parse(localStorage.getItem("selectedProduct"));

if (productName) {
  const savedList = JSON.parse(localStorage.getItem("yourTrendProducts")) || [];
  const found = savedList.find(p => p.name === productName);
  if (found) product = found;
}


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

  const stock = product.stock === "আছে" ? 999999 : Number(product.stock) || 0;

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


  const stock = product.stock === "আছে" ? 999999 : Number(product.stock) || 0;


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


  const stock = product.stock === "আছে" ? 999999 : Number(product.stock) || 0;


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
// Direct Product Order
// ======================================

async function orderSelectedProduct() {

  const name =
    document.getElementById("name").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const district =
    document.getElementById("district").value.trim();

  const upazila =
    document.getElementById("upazila").value.trim();

  const address =
    document.getElementById("address").value.trim();

  const deliveryCharge =
    Number(
      document.getElementById("deliveryArea").value
    );

  const size =
    getSelectedSize();

  const msg =
    document.getElementById("msg");


  // ==============================
  // VALIDATION
  // ==============================

  if (
    !name ||
    !phone ||
    !district ||
    !upazila ||
    !address
  ) {

    msg.innerText =
      "⚠️ সব তথ্য পূরণ করুন";

    msg.style.color = "red";

    return;

  }


  if (!size) {

    msg.innerText =
      "⚠️ Product-এর Size নির্বাচন করুন";

    msg.style.color = "red";

    return;

  }


  // ==============================
  // ORDER NUMBER
  // ==============================

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


  // ==============================
  // TRACKING TOKEN
  // ==============================

  const trackingToken =
    crypto.randomUUID();


  // ==============================
  // PRODUCT TOTAL
  // ==============================

  const productTotal =
    Number(product.price) *
    Number(selectedQuantity);


  const grandTotal =
    productTotal +
    deliveryCharge;


  // ==============================
  // ORDER ITEM
  // ==============================

  const orderItems = [

    {

      name:
        product.name,

      price:
        Number(product.price),

      quantity:
        Number(selectedQuantity),

      size:
        size,

      subtotal:
        productTotal,

      image:
        product.images?.[0] ||
        product.image ||
        ""

    }

  ];


  // ==============================
  // SAVE TO FIREBASE
  // ==============================

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

        trackingToken:
          trackingToken,

        customerName:
          name,

        phone:
          phone,

        district:
          district,

        upazila:
          upazila,

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
          "Cash on Delivery",

        status:
          "Pending",

        createdAt:
          serverTimestamp()

      }
    );


    // ==============================
    // ORDER TRACKING
    // ==============================

    await setDoc(
      doc(
        db,
        "orderTracking",
        orderId
      ),
      {

        orderNumber:
          orderId,

        status:
          "Pending"

      }
    );


    // ==============================
    // WHATSAPP MESSAGE
    // ==============================

    const orderText =

      "🛍️ YOUR TREND ORDER\n\n" +

      "🧾 Order ID: " +
      orderId +

      "\n\n📦 Product: " +
      product.name +

      "\n🔢 Quantity: " +
      selectedQuantity +

      "\n📏 Size: " +
      size +

      "\n💰 Price: ৳" +
      product.price +

      "\n💵 Subtotal: ৳" +
      productTotal +

      "\n\n🛍️ Product Total: ৳" +
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

      "\n🏙️ জেলা: " +
      district +

      "\n🏘️ উপজেলা: " +
      upazila +

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


    msg.innerText =
      "✅ Order Save হয়েছে। WhatsApp খোলা হচ্ছে...";

    msg.style.color =
      "green";


    setTimeout(
      function() {

        window.location.href =
          whatsappURL;

      },
      500
    );


  } catch (error) {

    console.error(
      "Direct Order save error:",
      error
    );


    msg.innerText =
      "❌ Order Save হয়নি: " +
      error.message;

    msg.style.color =
      "red";

  }

}

const districts = {
  "পঞ্চগড়":["পঞ্চগড় সদর","বোদা","দেবীগঞ্জ","আটোয়ারী","তেঁতুলিয়া"],
"ঠাকুরগাঁও":["ঠাকুরগাঁও সদর","পীরগঞ্জ","রাণীশংকৈল","বালিয়াডাঙ্গী","হরিপুর"],
"দিনাজপুর":["দিনাজপুর সদর","বিরল","বিরামপুর","বোচাগঞ্জ","চিরিরবন্দর","ফুলবাড়ী","ঘোড়াঘাট","হাকিমপুর","কাহারোল","খানসামা","নবাবগঞ্জ","পার্বতীপুর"],
"নীলফামারী":["নীলফামারী সদর","ডোমার","ডিমলা","জলঢাকা","কিশোরগঞ্জ","সৈয়দপুর"],
"লালমনিরহাট":["লালমনিরহাট সদর","আদিতমারী","কালীগঞ্জ","হাতীবান্ধা","পাটগ্রাম"],
"কুড়িগ্রাম":["কুড়িগ্রাম সদর","ভুরুঙ্গামারী","ফুলবাড়ী","রাজারহাট","উলিপুর","চিলমারী","নাগেশ্বরী","রৌমারী","রাজিবপুর"],
"রংপুর":["রংপুর সদর","বদরগঞ্জ","গঙ্গাচড়া","কাউনিয়া","মিঠাপুকুর","পীরগঞ্জ","পীরগাছা","তারাগঞ্জ"],
"গাইবান্ধা":["গাইবান্ধা সদর","সাদুল্লাপুর","সুন্দরগঞ্জ","পলাশবাড়ী","গোবিন্দগঞ্জ","ফুলছড়ি","সাঘাটা"],
"জয়পুরহাট":["জয়পুরহাট সদর","আক্কেলপুর","কালাই","ক্ষেতলাল","পাঁচবিবি"],
"বগুড়া":["বগুড়া সদর","আদমদীঘি","ধুনট","দুপচাঁচিয়া","গাবতলী","কাহালু","নন্দীগ্রাম","সারিয়াকান্দি","শাজাহানপুর","শিবগঞ্জ","সোনাতলা","শেরপুর"],
"নওগাঁ":["নওগাঁ সদর","আত্রাই","বদলগাছী","ধামইরহাট","মান্দা","মহাদেবপুর","নিয়ামতপুর","পত্নীতলা","পোরশা","রাণীনগর","সাপাহার"],
"রাজশাহী":["রাজশাহী সদর","বাগমারা","বাঘা","চারঘাট","দুর্গাপুর","গোদাগাড়ী","মোহনপুর","পবা","পুঠিয়া","তানোর"],
"নাটোর":["নাটোর সদর","বাগাতিপাড়া","বড়াইগ্রাম","গুরুদাসপুর","লালপুর","সিংড়া"],
"চাঁপাইনবাবগঞ্জ":["চাঁপাইনবাবগঞ্জ সদর","ভোলাহাট","গোমস্তাপুর","নাচোল","শিবগঞ্জ"],
"সিরাজগঞ্জ":["সিরাজগঞ্জ সদর","বেলকুচি","চৌহালী","কামারখন্দ","কাজীপুর","রায়গঞ্জ","শাহজাদপুর","তাড়াশ","উল্লাপাড়া"],
"পাবনা":["পাবনা সদর","আটঘরিয়া","ভাঙ্গুড়া","চাটমোহর","ফরিদপুর","ঈশ্বরদী","সাঁথিয়া","সুজানগর","বেড়া"],
"ঢাকা":["ঢাকা সদর","সাভার","ধামরাই","কেরানীগঞ্জ","দোহার","নবাবগঞ্জ"],
"গাজীপুর":["গাজীপুর সদর","কালিয়াকৈর","কালীগঞ্জ","কাপাসিয়া","শ্রীপুর"],
"নারায়ণগঞ্জ":["নারায়ণগঞ্জ সদর","আড়াইহাজার","বন্দর","রূপগঞ্জ","সোনারগাঁ"],
"নরসিংদী":["নরসিংদী সদর","বেলাবো","মনোহরদী","পলাশ","রায়পুরা","শিবপুর"],
"মানিকগঞ্জ":["মানিকগঞ্জ সদর","দৌলতপুর","ঘিওর","হরিরামপুর","সাটুরিয়া","শিবালয়","সিঙ্গাইর"],
"মুন্সিগঞ্জ":["মুন্সিগঞ্জ সদর","গজারিয়া","লৌহজং","সিরাজদিখান","শ্রীনগর","টঙ্গীবাড়ী"],
"টাঙ্গাইল":["টাঙ্গাইল সদর","বাসাইল","ভুয়াপুর","দেলদুয়ার","ঘাটাইল","গোপালপুর","কালিহাতী","মধুপুর","মির্জাপুর","নাগরপুর","সখীপুর","ধনবাড়ী"],
"কিশোরগঞ্জ":["কিশোরগঞ্জ সদর","অষ্টগ্রাম","বাজিতপুর","ভৈরব","হোসেনপুর","ইটনা","করিমগঞ্জ","কটিয়াদী","কুলিয়ারচর","মিঠামইন","নিকলী","পাকুন্দিয়া","তাড়াইল"],
"ময়মনসিংহ":["ময়মনসিংহ সদর","ভালুকা","ত্রিশাল","গফরগাঁও","ফুলপুর","মুক্তাগাছা","ধোবাউড়া","ফুলবাড়ীয়া","গৌরীপুর","ঈশ্বরগঞ্জ","নান্দাইল","হালুয়াঘাট","তারাকান্দা"],
"জামালপুর":["জামালপুর সদর","বকশীগঞ্জ","দেওয়ানগঞ্জ","ইসলামপুর","মাদারগঞ্জ","মেলান্দহ","সরিষাবাড়ী"],
"শেরপুর":["শেরপুর সদর","ঝিনাইগাতী","নকলা","নালিতাবাড়ী","শ্রীবরদী"],
"নেত্রকোনা":["নেত্রকোনা সদর","আটপাড়া","বারহাট্টা","দুর্গাপুর","খালিয়াজুড়ি","কলমাকান্দা","কেন্দুয়া","মদন","মোহনগঞ্জ","পূর্বধলা"],
"চট্টগ্রাম":["চট্টগ্রাম সদর","আনোয়ারা","বাঁশখালী","বোয়ালখালী","চন্দনাইশ","ফটিকছড়ি","হাটহাজারী","লোহাগাড়া","মীরসরাই","পটিয়া","রাউজান","রাঙ্গুনিয়া","সন্দ্বীপ","সাতকানিয়া","সীতাকুণ্ড"],
"কক্সবাজার":["কক্সবাজার সদর","চকরিয়া","কুতুবদিয়া","মহেশখালী","পেকুয়া","রামু","টেকনাফ","উখিয়া"],
"কুমিল্লা":["কুমিল্লা সদর","আদর্শ সদর","বরুড়া","ব্রাহ্মণপাড়া","বুড়িচং","চান্দিনা","চৌদ্দগ্রাম","দাউদকান্দি","দেবিদ্বার","হোমনা","লাকসাম","লালমাই","মেঘনা","মুরাদনগর","নাঙ্গলকোট","মনোহরগঞ্জ","তিতাস"],
"ব্রাহ্মণবাড়িয়া":["ব্রাহ্মণবাড়িয়া সদর","আখাউড়া","আশুগঞ্জ","বাঞ্ছারামপুর","বিজয়নগর","কসবা","নাসিরনগর","নবীনগর","সরাইল"],
  "চাঁদপুর":["চাঁদপুর সদর","ফরিদগঞ্জ","হাইমচর","হাজীগঞ্জ","কচুয়া","মতলব দক্ষিণ","মতলব উত্তর","শাহরাস্তি"],
"ফেনী":["ফেনী সদর","ছাগলনাইয়া","দাগনভূঞা","পরশুরাম","ফুলগাজী","সোনাগাজী"],
"নোয়াখালী":["নোয়াখালী সদর","বেগমগঞ্জ","চাটখিল","কোম্পানীগঞ্জ","হাতিয়া","কবিরহাট","সেনবাগ","সুবর্ণচর"],
"লক্ষ্মীপুর":["লক্ষ্মীপুর সদর","কমলনগর","রামগঞ্জ","রামগতি","রায়পুর"],
"খাগড়াছড়ি":["খাগড়াছড়ি সদর","দীঘিনালা","গুইমারা","লক্ষ্মীছড়ি","মহালছড়ি","মানিকছড়ি","মাটিরাঙ্গা","পানছড়ি","রামগড়"],
"রাঙ্গামাটি":["রাঙ্গামাটি সদর","বাঘাইছড়ি","বরকল","বিলাইছড়ি","জুরাছড়ি","কাপ্তাই","কাউখালী","লংগদু","নানিয়ারচর","রাজস্থলী"],
"বান্দরবান":["বান্দরবান সদর","আলীকদম","লামা","নাইক্ষ্যংছড়ি","রুমা","রোয়াংছড়ি","থানচি"],

"যশোর":["যশোর সদর","অভয়নগর","বাঘারপাড়া","চৌগাছা","ঝিকরগাছা","কেশবপুর","মনিরামপুর","শার্শা"],
"ঝিনাইদহ":["ঝিনাইদহ সদর","কালীগঞ্জ","কোটচাঁদপুর","মহেশপুর","শৈলকুপা","হরিণাকুণ্ডু"],
"মাগুরা":["মাগুরা সদর","মোহাম্মদপুর","শালিখা","শ্রীপুর"],
"নড়াইল":["নড়াইল সদর","কালিয়া","লোহাগড়া"],
"কুষ্টিয়া":["কুষ্টিয়া সদর","ভেড়ামারা","দৌলতপুর","খোকসা","কুমারখালী","মিরপুর"],
"চুয়াডাঙ্গা":["চুয়াডাঙ্গা সদর","আলমডাঙ্গা","দামুড়হুদা","জীবননগর"],
"মেহেরপুর":["মেহেরপুর সদর","গাংনী","মুজিবনগর"],
"খুলনা":["খুলনা সদর","বটিয়াঘাটা","দাকোপ","ডুমুরিয়া","দিঘলিয়া","কয়রা","পাইকগাছা","ফুলতলা","রূপসা","তেরখাদা"],
"বাগেরহাট":["বাগেরহাট সদর","চিতলমারী","ফকিরহাট","কচুয়া","মোল্লাহাট","মোংলা","মোরেলগঞ্জ","রামপাল","শরণখোলা"],
"সাতক্ষীরা":["সাতক্ষীরা সদর","আশাশুনি","দেবহাটা","কলারোয়া","কালীগঞ্জ","শ্যামনগর","তালা"],

"বরিশাল":["বরিশাল সদর","আগৈলঝাড়া","বাবুগঞ্জ","বাকেরগঞ্জ","বানারীপাড়া","গৌরনদী","হিজলা","মেহেন্দিগঞ্জ","মুলাদী","উজিরপুর"],
"পটুয়াখালী":["পটুয়াখালী সদর","বাউফল","দশমিনা","দুমকি","গলাচিপা","কলাপাড়া","মির্জাগঞ্জ","রাঙ্গাবালী"],
"ভোলা":["ভোলা সদর","বোরহানউদ্দিন","চরফ্যাশন","দৌলতখান","লালমোহন","মনপুরা","তজুমদ্দিন"],
"পিরোজপুর":["পিরোজপুর সদর","ভান্ডারিয়া","কাউখালী","মঠবাড়িয়া","নাজিরপুর","নেছারাবাদ","জিয়ানগর"],
"ঝালকাঠি":["ঝালকাঠি সদর","কাঁঠালিয়া","নলছিটি","রাজাপুর"],
"বরগুনা":["বরগুনা সদর","আমতলী","বামনা","বেতাগী","পাথরঘাটা","তালতলী"],

"সিলেট":["সিলেট সদর","বালাগঞ্জ","বিয়ানীবাজার","বিশ্বনাথ","কোম্পানীগঞ্জ","ফেঞ্চুগঞ্জ","গোলাপগঞ্জ","গোয়াইনঘাট","জৈন্তাপুর","কানাইঘাট","দক্ষিণ সুরমা","জকিগঞ্জ"],
"মৌলভীবাজার":["মৌলভীবাজার সদর","বড়লেখা","জুড়ী","কমলগঞ্জ","কুলাউড়া","রাজনগর","শ্রীমঙ্গল"],
"হবিগঞ্জ":["হবিগঞ্জ সদর","আজমিরীগঞ্জ","বাহুবল","বানিয়াচং","চুনারুঘাট","লাখাই","মাধবপুর","নবীগঞ্জ"],
"সুনামগঞ্জ":["সুনামগঞ্জ সদর","ছাতক","দিরাই","ধর্মপাশা","দোয়ারাবাজার","জগন্নাথপুর","জামালগঞ্জ","শাল্লা","তাহিরপুর","বিশ্বম্ভরপুর"],

"মাদারীপুর":["মাদারীপুর সদর","কালকিনি","রাজৈর","শিবচর"],
"শরীয়তপুর":["শরীয়তপুর সদর","ডামুড্যা","গোসাইরহাট","নড়িয়া","ভেদরগঞ্জ","জাজিরা"],
"ফরিদপুর":["ফরিদপুর সদর","আলফাডাঙ্গা","ভাঙ্গা","বোয়ালমারী","চরভদ্রাসন","মধুখালী","নগরকান্দা","সদরপুর","সালথা"],
"গোপালগঞ্জ":["গোপালগঞ্জ সদর","কাশিয়ানী","কোটালীপাড়া","মুকসুদপুর","টুঙ্গিপাড়া"],
"রাজবাড়ী":["রাজবাড়ী সদর","বালিয়াকান্দি","গোয়ালন্দ","কালুখালী","পাংশা"]
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
window.onload = function () {
  // Product Details
  document.getElementById("productImage").src =
    product.images?.[0] || product.image;

  document.getElementById("productName").innerText = product.name;
  document.getElementById("productPrice").innerText = product.price;
  document.getElementById("productDescription").innerText = product.description;

  // Gallery
  const gallery = document.getElementById("imageGallery");
  gallery.innerHTML = "";

  (product.images || [product.image]).forEach(img => {
    gallery.innerHTML += `
      <img src="${img}"
      style="width:70px;height:70px;border-radius:8px;object-fit:cover"
      onclick="document.getElementById('productImage').src='${img}'">`;
  });
districtSelect.innerHTML = '<option value="">জেলা নির্বাচন করুন</option>';
upazilaSelect.innerHTML = '<option value="">উপজেলা নির্বাচন করুন</option>';
  // District
  Object.keys(districts).sort().forEach(d => {
    districtSelect.innerHTML += `<option value="${d}">${d}</option>`;
  });
};window.orderSelectedProduct = orderSelectedProduct;
document.getElementById("directOrderBtn")
  .addEventListener("click", orderSelectedProduct);
window.increaseProductQuantity = increaseProductQuantity;
window.decreaseProductQuantity = decreaseProductQuantity;
window.addSelectedProduct = addSelectedProduct;
window.goCheckout = goCheckout;
document.getElementById("directOrderBtn")
  .addEventListener("click", orderSelectedProduct);
