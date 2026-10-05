let db;
let lastVisibleDoc = null;
let hasMoreProducts = false;
let list = [];


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

  products.forEach((p) => {
    const stock = String(p.stock).trim();
    const out = (stock === "নেই" || stock === "0");

    box.innerHTML += `
      <div class="card" onclick="openProduct('${p.id}')">
        <span class="product-badge">${
  String(p.category || "").trim().toLowerCase() === "fashion"
    ? "👕 FASHION"
  : String(p.category || "").trim().toLowerCase() === "gadgets"
    ? "⌚ GADGETS"
  : String(p.category || "").trim().toLowerCase() === "bags"
    ? "🎒 BAGS"
  : String(p.category || "").trim().toLowerCase() === "kids"
    ? "🧒 KIDS FASHION"
  : String(p.category || "").trim().toLowerCase() === "men"
    ? "👨 MEN'S FASHION"
  : String(p.category || "").trim().toLowerCase() === "women"
    ? "👩 WOMEN'S FASHION"
  : "✨ PRODUCT"
}</span>
        <img class="img" src="${p.image}" alt="${p.name}">

        <h3>${p.name}</h3>
        <p><b>৳${p.price}</b></p>

        <p style="color:${out ? "red" : "green"};font-weight:bold;">
          ${out ? "❌ Out of Stock" : `📦 Stock: ${stock}`}
        </p>

        ${
          out
            ? `<button class="btn" disabled style="background:#999">❌ Out of Stock</button>`
            : `<button class="btn" onclick="event.stopPropagation(); addCart('${p.name}')">🛒 Add to Cart</button>`
        }
      </div>`;
  });
}
// =========================
// FIREBASE PRODUCTS
// =========================
async function loadFirebaseProducts() {

  try {

    const {
      initializeApp
    } = await import(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"
    );

    const {
      getFirestore,
      collection,
      getDocs,
      query,
      limit,
      startAfter
    } = await import(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
    );

    const firebaseConfig = {

    apiKey:
  "AIzaSyAfYg-SdoKLFGuEtzFZdqwpqHRRdEuiuQI",

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


    let lastVisibleDoc = null;


    // =========================
    // FIRST 24 PRODUCTS
    // =========================

    const firstQuery = query(
      collection(db, "products"),
      limit(25)
    );

    const snapshot =
      await getDocs(firstQuery);


    const firebaseList = [];


    snapshot.docs.forEach(
      function(productDoc, index) {

        // ২৫তম প্রোডাক্ট শুধু বুঝতে ব্যবহার হবে
        // সেটি দেখানো হবে না
        if (index >= 24) return;


        const product =
          productDoc.data();


        firebaseList.push({

          id:
            productDoc.id,

          name:
            product.name,

          price:
            Number(product.price) || 0,

          image:
            product.images?.[0] ||
            product.image ||
            "",

          images:
            product.images ||
            (
              product.image
                ? [product.image]
                : []
            ),

          category:
            product.category ||
            "fashion",

          description:
            product.description ||
            "",

          stock:
            String(
              product.stock ?? "0"
            ).trim(),

          sizes:
            product.sizes || []

        });

      }
    );


    // ২৪টি প্রোডাক্ট দেখাও

    if (firebaseList.length > 0) {

      list =
        firebaseList;

      localStorage.setItem(
        "yourTrendProducts",
        JSON.stringify(list)
      );

    }


    showProducts(list);


    // =========================
    // LOAD MORE BUTTON
    // =========================

    const oldButton =
      document.getElementById(
        "loadMoreBtn"
      );

    if (oldButton) {
      oldButton.remove();
    }


    // ২৫টি পাওয়া গেলে বুঝবো আরও আছে

    if (snapshot.docs.length > 24) {

      lastVisibleDoc =
        snapshot.docs[23];


      const moreButton =
        document.createElement("button");


      moreButton.id =
        "loadMoreBtn";


      moreButton.innerText =
        "আরও প্রোডাক্ট দেখুন";


      moreButton.className =
        "btn";


      moreButton.style.display =
        "block";


      moreButton.style.margin =
        "25px auto";


      moreButton.style.padding =
        "12px 25px";


      moreButton.onclick =
        loadMoreProducts;


      box.insertAdjacentElement(
        "afterend",
        moreButton
      );

    }


    // =========================
    // LOAD MORE FUNCTION
    // =========================

    async function loadMoreProducts() {

      if (!lastVisibleDoc) {
        return;
      }


      try {

        const nextQuery =
          query(
            collection(db, "products"),
            startAfter(lastVisibleDoc),
            limit(25)
          );


        const nextSnapshot =
          await getDocs(nextQuery);


        const newProducts = [];


        nextSnapshot.docs.forEach(
          function(productDoc, index) {

            if (index >= 24) return;


            const product =
              productDoc.data();


            newProducts.push({

              id:
                productDoc.id,

              name:
                product.name,

              price:
                Number(product.price) || 0,

              image:
                product.images?.[0] ||
                product.image ||
                "",

              images:
                product.images ||
                (
                  product.image
                    ? [product.image]
                    : []
                ),

              category:
  String(product.category || "").trim().toLowerCase(),

              description:
                product.description ||
                "",

              stock:
                String(
                  product.stock ?? "0"
                ).trim(),

              sizes:
                product.sizes || []

            });

          }
        );


        // নতুন প্রোডাক্ট list-এ যোগ

        list =
          list.concat(
            newProducts
          );


        localStorage.setItem(
          "yourTrendProducts",
          JSON.stringify(list)
        );


        // =========================
        // নতুন ২৪টি কার্ড দেখানো
        // =========================

        newProducts.forEach(
          function(p) {

            const stock =
              String(p.stock).trim();


            const out =
              stock === "নেই" ||
              stock === "0";


            box.innerHTML += `

              <div
                class="card"
                onclick="openProduct('${p.id}')"
              >

                <span class="product-badge">

  ${
    String(p.category || "").trim().toLowerCase() === "fashion"
      ? "👕 FASHION"
      : String(p.category || "").trim().toLowerCase() === "gadgets"
      ? "⌚ GADGETS"
      : String(p.category || "").trim().toLowerCase() === "bags"
      ? "🎒 BAGS"
      : String(p.category || "").trim().toLowerCase() === "kids"
      ? "🧒 KIDS FASHION"
      : String(p.category || "").trim().toLowerCase() === "men"
      ? "👨 MEN'S FASHION"
      : String(p.category || "").trim().toLowerCase() === "women"
      ? "👩 WOMEN'S FASHION"
      : "✨ PRODUCT"
  }

</span>


                <img
                  class="img"
                  src="${p.image}"
                  alt="${p.name}"
                >


                <h3>
                  ${p.name}
                </h3>


                <p>
                  <b>
                    ৳${p.price}
                  </b>
                </p>


                <p
                  style="
                    color:${out ? "red" : "green"};
                    font-weight:bold;
                  "
                >

                  ${
                    out
                      ? "❌ Out of Stock"
                      : `📦 Stock: ${stock}`
                  }

                </p>


                ${
                  out

                    ? `
                      <button
                        class="btn"
                        disabled
                        style="background:#999"
                      >
                        ❌ Out of Stock
                      </button>
                    `

                    : `
                      <button
                        class="btn"
                        onclick="
                          event.stopPropagation();
                          addCart('${p.name}')
                        "
                      >
                        🛒 Add to Cart
                      </button>
                    `
                }

              </div>

            `;

          }
        );


        // =========================
        // পরের পেজ আছে কি না
        // =========================

        if (
          nextSnapshot.docs.length > 24
        ) {

          lastVisibleDoc =
            nextSnapshot.docs[23];

        } else {

          lastVisibleDoc =
            null;


          const button =
            document.getElementById(
              "loadMoreBtn"
            );


          if (button) {
            button.remove();
          }

        }


      } catch (error) {

        console.error(
          "Load more products error:",
          error
        );


        alert(
          "আরও প্রোডাক্ট লোড করা যায়নি।"
        );

      }

    }


  } catch (error) {

    console.error(
      "Firebase products error:",
      error
    );


    showProducts(list);

  }

}


loadFirebaseProducts();


          

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

  const product = list.find(p => p.name === productName);
  if (!product) return;

  const stock = String(product.stock).trim();

  // শুধু "নেই" বা "0" হলে বন্ধ
  if (stock === "নেই" || stock === "0") {
    alert("❌ এই Product বর্তমানে Out of Stock");
    return;
  }

  const existing = cartItems.find(item => item.name === productName);

  if (existing) {
    if (!isNaN(Number(stock)) && existing.quantity >= Number(stock)) {
      alert("⚠️ স্টকের বেশি নিতে পারবেন না।");
      return;
    }
    existing.quantity++;
  } else {
    cartItems.push({
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: stock,
      sizes: product.sizes || []
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
      "\n" +

      "🖼️ Product Image: https://hossainmdsarowar464-byte.github.io/your-trend/" +
item.image +
"\n\n";

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

function openProduct(productId) {

  const product = list.find(function (p) {
    return p.id === productId;
  });

  if (!product) {
    alert("⚠️ Product পাওয়া যায়নি");
    return;
  }

  localStorage.setItem(
    "selectedProduct",
    JSON.stringify(product)
  );

  window.location.href =
    "product.html?id=" +
    encodeURIComponent(product.id);
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

}function shareProduct(productName) {

  const url =
    "https://hossainmdsarowar464-byte.github.io/your-trend/product.html?id=" +
    encodeURIComponent(productName);

  window.open(
    "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent(url),
    "_blank"
  );

}/* =========================
   YOUR TREND VISITOR TRACKING
========================= */

async function trackVisitor() {

  try {

    const {
      initializeApp,
      getApps
    } = await import(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"
    );

    const {
      getFirestore,
      doc,
      setDoc,
      serverTimestamp
    } = await import(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
    );


    const firebaseConfig = {

      apiKey:
  "AIzaSyAfYg-SdoKLFGuEtzFZdqwpqHRRdEuiuQI",

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
      getApps().length
        ? getApps()[0]
        : initializeApp(firebaseConfig);


    const db =
      getFirestore(app);


    /* =========================
       UNIQUE VISITOR ID
    ========================= */

    let visitorId =
      localStorage.getItem(
        "yourTrendVisitorId"
      );


    if (!visitorId) {

      visitorId =
        "visitor_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .substring(2, 10);


      localStorage.setItem(
        "yourTrendVisitorId",
        visitorId
      );

    }


    /* =========================
   TODAY - BANGLADESH TIME
========================= */

const today =
  new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(new Date());


    const visitId =
      visitorId +
      "_" +
      today;


    /* =========================
       SAVE VISITOR
    ========================= */

    await setDoc(

      doc(
        db,
        "visits",
        visitId
      ),

      {

        visitorId:
          visitorId,

        date:
          today,

        lastVisit:
          serverTimestamp(),

        page:
          window.location.pathname

      },

      {
        merge: true
      }

    );


    console.log(
      "✅ Visitor tracked"
    );


  } catch (error) {

    console.error(
      "Visitor Tracking Error:",
      error
    );

  }

}


trackVisitor();
/* =====================================================
   YOUR TREND BANNER
   INFINITE AUTO SLIDE + SWIPE
   ===================================================== */

const bannerSlider = document.querySelector(".bannerSlider");
const bannerSlides = document.querySelector(".bannerSlides");

if (bannerSlider && bannerSlides) {

  const originalBanners = Array.from(
    bannerSlides.querySelectorAll("img")
  );

  const total = originalBanners.length;

  if (total > 1) {

    // প্রথম ও শেষ ব্যানারের clone
    const firstClone = originalBanners[0].cloneNode(true);
    const lastClone = originalBanners[total - 1].cloneNode(true);

    bannerSlides.appendChild(firstClone);
    bannerSlides.insertBefore(lastClone, bannerSlides.firstChild);

    let index = 1;
    let startX = 0;
    let autoSlide;

    function moveBanner(animate = true) {

      bannerSlides.style.transition =
        animate ? "transform 0.5s ease" : "none";

      bannerSlides.style.transform =
        "translateX(-" + (index * window.innerWidth) + "px)";
    }

    // শুরুতে প্রথম আসল ব্যানার
    moveBanner(false);

    // পরের ব্যানার
    function nextBanner() {

      index++;
      moveBanner(true);
    }

    // আগের ব্যানার
    function previousBanner() {

      index--;
      moveBanner(true);
    }

    // Auto slide
    function startAutoSlide() {

      clearInterval(autoSlide);

      autoSlide = setInterval(function () {

        nextBanner();

      }, 5000);
    }

    startAutoSlide();

    // শেষ clone-এ গেলে আসল প্রথম ব্যানারে নিঃশব্দে ফিরে যাবে
    bannerSlides.addEventListener("transitionend", function () {

      if (index === total + 1) {

        index = 1;

        moveBanner(false);

        void bannerSlides.offsetWidth;

      }

      if (index === 0) {

        index = total;

        moveBanner(false);

        void bannerSlides.offsetWidth;

      }

    });

    // Swipe শুরু
    bannerSlider.addEventListener("touchstart", function (e) {

      startX = e.touches[0].clientX;

      clearInterval(autoSlide);

    }, { passive: true });

    // Swipe শেষ
    bannerSlider.addEventListener("touchend", function (e) {

      const endX = e.changedTouches[0].clientX;
      const distance = startX - endX;

      if (Math.abs(distance) >= 50) {

        if (distance > 0) {

          nextBanner();

        } else {

          previousBanner();

        }

      }

      startAutoSlide();

    }, { passive: true });

    // Screen size পরিবর্তন হলে position ঠিক রাখা
    window.addEventListener("resize", function () {

      moveBanner(false);

    });

  }

}
       
