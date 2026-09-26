import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =========================
   FIREBASE
========================= */

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

const auth =
  getAuth(app);

const db =
  getFirestore(app);


/* =========================
   CLOUDINARY
========================= */

const CLOUDINARY_CLOUD_NAME =
  "fq6ele9x";

const CLOUDINARY_UPLOAD_PRESET =
  "your_trend_products";


/* =========================
   VARIABLES
========================= */

let uploadedImages = [];

let editingProductId = null;

let uploadWidget = null;

let uploadedBannerURL = "";

let bannerUploadWidget = null;
/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(
  auth,
  function(user) {

    console.log(
      "AUTH USER:",
      user
    );

    if (!user) {

      alert(
        "❌ Firebase বলছে আপনি Login করা নেই।"
      );

      window.location.href =
        "admin-login.html";

      return;
    }


    console.log(
      "✅ Admin Login detected:",
      user.email
    );


    loadProducts();

    loadOrders();

    loadCurrentBanner();

  }
);



  /* =========================
   DOM READY
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    setupLogout();

    setupCloudinaryWidget();

    setupSelectImageButton();

    setupSelectBannerButton();

    setupProductButtons();

  }
);


/* =========================
   SELECT BANNER
========================= */

function setupSelectBannerButton() {

  const selectBannerBtn =
    document.getElementById(
      "selectBannerBtn"
    );

  if (!selectBannerBtn) {

    console.error(
      "selectBannerBtn পাওয়া যায়নি"
    );

    return;
  }


  selectBannerBtn.addEventListener(
    "click",
    function() {

      console.log(
        "✅ Select New Banner clicked"
      );


      if (
        typeof cloudinary ===
        "undefined"
      ) {

        alert(
          "❌ Cloudinary Widget load হয়নি।"
        );

        console.error(
          "Cloudinary is undefined"
        );

        return;
      }


      if (!bannerUploadWidget) {

        setupBannerUploadWidget();

      }


      if (!bannerUploadWidget) {

        alert(
          "❌ Banner upload widget তৈরি হয়নি।"
        );

        return;
      }


      bannerUploadWidget.open();

    }
  );

}


/* =========================
   LOGOUT
========================= */

function setupLogout() {

  const logoutBtn =
    document.getElementById(
      "logoutBtn"
    );


  if (!logoutBtn) {

    console.error(
      "logoutBtn পাওয়া যায়নি"
    );

    return;

  }


  logoutBtn.addEventListener(
    "click",
    async function() {

      try {

        await signOut(auth);

        window.location.href =
          "admin-login.html";

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Logout করতে সমস্যা হয়েছে: " +
          error.message
        );

      }

    }
  );

}


/* =========================
   CLOUDINARY PRODUCT WIDGET
========================= */

function setupCloudinaryWidget() {

  if (
    typeof cloudinary ===
    "undefined"
  ) {

    console.error(
      "Cloudinary Widget load হয়নি"
    );

    const status =
      document.getElementById(
        "imageStatus"
      );

    if (status) {

      status.innerText =
        "❌ Cloudinary load হয়নি";

    }

    return;

  }


  uploadWidget =
    cloudinary.createUploadWidget(

      {

        cloudName:
          CLOUDINARY_CLOUD_NAME,

        uploadPreset:
          CLOUDINARY_UPLOAD_PRESET,

        sources:
          ["local"],

        multiple: true,
maxFiles: 12,

        resourceType:
          "image",

        clientAllowedFormats:
          [
            "jpg",
            "jpeg",
            "png",
            "webp"
          ],

        maxFileSize:
          5000000

      },

      function(error, result) {

        if (error) {

          console.error(
            "Cloudinary Error:",
            error
          );

          const status =
            document.getElementById(
              "imageStatus"
            );

          if (status) {

            status.innerText =
              "❌ Image upload failed";

          }

          return;

        }


        if (
          result &&
          result.event ===
            "success"
        ) {

          uploadedImages.push(result.info.secure_url);


          const preview =
            document.getElementById(
              "imagePreview"
            );


          if (preview) {

            preview.src = uploadedImages[0];

            preview.style.display =
              "block";

          }


          const status =
            document.getElementById(
              "imageStatus"
            );


          if (status) {

            status.innerText =
              "✅ নতুন Image নির্বাচন করা হয়েছে";

            status.style.color =
              "green";

          }

        }

      }

    );

}
/* =========================
   BANNER CLOUDINARY WIDGET
========================= */

function setupBannerUploadWidget() {

  if (
    typeof cloudinary ===
    "undefined"
  ) {

    console.error(
      "Cloudinary Widget load হয়নি"
    );

    return;

  }


  bannerUploadWidget =
    cloudinary.createUploadWidget(

      {

        cloudName:
          CLOUDINARY_CLOUD_NAME,

        uploadPreset:
          CLOUDINARY_UPLOAD_PRESET,

        sources:
          ["local"],

        multiple:
          false,

        maxFiles:
          1,

        resourceType:
          "image",

        clientAllowedFormats:
          [
            "jpg",
            "jpeg",
            "png",
            "webp"
          ],

        maxFileSize:
          10000000

      },

      function(error, result) {

        if (error) {

          console.error(
            "Banner Cloudinary Error:",
            error
          );

          const status =
            document.getElementById(
              "bannerImageStatus"
            );

          if (status) {

            status.innerText =
              "❌ Banner upload failed";

            status.style.color =
              "red";

          }

          return;

        }


        if (
          result &&
          result.event ===
            "success"
        ) {

          uploadedBannerURL =
            result.info.secure_url;


          const preview =
            document.getElementById(
              "bannerPreview"
            );


          if (preview) {

            preview.src =
              uploadedBannerURL;

            preview.style.display =
              "block";

          }


          const status =
            document.getElementById(
              "bannerImageStatus"
            );


          if (status) {

            status.innerText =
              "✅ নতুন Banner নির্বাচন করা হয়েছে";

            status.style.color =
              "green";

          }


          const updateButton =
            document.getElementById(
              "updateBannerBtn"
            );


          if (updateButton) {

            updateButton.style.display =
              "block";

          }

        }

      }

    );

          }

/* =========================
   SELECT PRODUCT IMAGE
========================= */

function setupSelectImageButton() {

  const selectImageBtn =
    document.getElementById(
      "selectImageBtn"
    );


  if (!selectImageBtn) {

    console.error(
      "selectImageBtn পাওয়া যায়নি"
    );

    return;

  }


  selectImageBtn.addEventListener(
    "click",
    function() {

      if (!uploadWidget) {

        alert(
          "Cloudinary এখনও প্রস্তুত হয়নি। একটু পরে আবার চেষ্টা করুন।"
        );

        setupCloudinaryWidget();

        return;

      }


      uploadWidget.open();

    }
  );

}


/* =========================
   LOAD CURRENT WEBSITE BANNER
========================= */

async function loadCurrentBanner() {

  const bannerStatus =
    document.getElementById(
      "bannerStatus"
    );

  const currentBannerPreview =
    document.getElementById(
      "currentBannerPreview"
    );


  if (
    !bannerStatus ||
    !currentBannerPreview
  ) {

    console.warn(
      "Banner elements পাওয়া যায়নি"
    );

    return;

  }


  try {

    bannerStatus.innerText =
      "⏳ Banner loading...";


    const bannerRef =
      doc(
        db,
        "siteSettings",
        "banner"
      );


    const bannerSnap =
      await getDoc(
        bannerRef
      );


    if (
      bannerSnap.exists()
    ) {

      const data =
        bannerSnap.data();


      const bannerURL =
        data.image || "";


      if (bannerURL) {

        currentBannerPreview.src =
          bannerURL;

        currentBannerPreview.style.display =
          "block";


        bannerStatus.innerText =
          "✅ Current Website Banner";


        bannerStatus.style.color =
          "green";

      } else {

        bannerStatus.innerText =
          "⚠️ এখনো কোনো Banner Save করা হয়নি";

        bannerStatus.style.color =
          "#64748b";

      }

    } else {

      bannerStatus.innerText =
        "⚠️ এখনো কোনো Banner Save করা হয়নি";

      bannerStatus.style.color =
        "#64748b";

    }

  } catch (error) {

    console.error(
      "Banner load error:",
      error
    );


    bannerStatus.innerText =
      "❌ Banner load করতে সমস্যা হয়েছে: " +
      error.message;


    bannerStatus.style.color =
      "red";

  }

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

  const productList =
    document.getElementById(
      "productList"
    );


  if (!productList) {

    console.error(
      "productList পাওয়া যায়নি"
    );

    return;

  }


  productList.innerHTML =
    "⏳ Products loading...";


  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "products"
        )
      );


    productList.innerHTML =
      "";


    if (snapshot.empty) {

      productList.innerHTML =
        "<p>কোনো Product পাওয়া যায়নি।</p>";

      return;

    }


    snapshot.forEach(
      function(productDoc) {

        const product =
          productDoc.data();


        const hasStock =
          product.stock !== undefined &&
          product.stock !== null &&
          product.stock !== "";


        const stock =
          hasStock
            ? Number(product.stock)
            : null;


        const item =
          document.createElement(
            "div"
          );


        item.className =
          "product-item";


        item.innerHTML = `

          <img
            src="${product.images?.[0] || product.image || ""}"
            alt="${product.name || "Product"}"
          >

          <div class="product-info">

            <b>
              ${product.name || "Unnamed Product"}
            </b>

            <span>
              💰 Price:
              ৳${product.price || 0}
            </span>

            <span>
              📦 Stock:
              ${
                stock === null
                  ? "Not set"
                  : stock
              }
            </span>

            <span>
              🏷️ Category:
              ${product.category || ""}
            </span>

          </div>

          <button
            class="edit-btn"
            type="button"
          >
            ✏️ Edit
          </button>

          <button
            class="delete-btn"
            type="button"
          >
            🗑️ Delete
          </button>
          

        `;


        productList.appendChild(
          item
        );


        item
          .querySelector(
            ".edit-btn"
          )
          .addEventListener(
            "click",
            function() {

              editProduct(
                productDoc.id,
                product
              );

            }
          );
      


        item
          .querySelector(
            ".delete-btn"
          )
          .addEventListener(
            "click",
            function() {

              deleteProduct(
                productDoc.id,
                product
              );

            }
          );

      }
    );


  } catch (error) {

    console.error(
      "Product load error:",
      error
    );


    productList.innerHTML = `

      <p style="color:red;">
        ❌ Product load করতে সমস্যা হয়েছে।
      </p>

      <p style="color:#777;font-size:13px;">
        ${error.message}
      </p>

    `;

  }

}


/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(
  productId,
  product
) {

  const productName =
    product.name ||
    "এই Product";


  const confirmed =
    confirm(
      "⚠️ আপনি কি এই Product টি Delete করতে চান?\n\n" +
      productName +
      "\n\nএই কাজটি Undo করা যাবে না।"
    );


  if (!confirmed) {

    return;

  }


  try {

    const productRef =
      doc(
        db,
        "products",
        productId
      );


    await deleteDoc(
      productRef
    );


    alert(
      "✅ Product সফলভাবে Delete হয়েছে।"
    );


    await loadProducts();


  } catch (error) {

    console.error(
      "Delete error:",
      error
    );


    alert(
      "❌ Product Delete করতে সমস্যা হয়েছে:\n" +
      error.message
    );

  }

}


/* =========================
   EDIT PRODUCT
========================= */

function editProduct(
  productId,
  product
) {

  editingProductId =
    productId;


  const editMode =
    document.getElementById(
      "editMode"
    );

  if (editMode) {

    editMode.style.display =
      "block";

  }


  document
    .getElementById(
      "productName"
    )
    .value =
      product.name || "";


  document
    .getElementById(
      "productPrice"
    )
    .value =
      product.price ?? "";


  document
    .getElementById(
      "productStock"
    )
    .value =
      product.stock ?? "";


  document
    .getElementById(
      "productCategory"
    )
    .value =
      product.category || "fashion";


  document
    .getElementById(
      "productDescription"
    )
    .value =
      product.description || "";


  uploadedImages = product.images || [product.image];


  const preview =
    document.getElementById(
      "imagePreview"
    );


  if (uploadedImages.length > 0) {

    preview.src = uploadedImages[0];

    preview.style.display =
      "block";

  } else {

    preview.src = "";

    preview.style.display =
      "none";

  }


  const imageStatus =
    document.getElementById(
      "imageStatus"
    );


  imageStatus.innerText =
    "✅ আগের Image ব্যবহার করা হবে";


  imageStatus.style.color =
    "green";


  document
    .getElementById(
      "saveProductBtn"
    )
    .innerText =
      "💾 Save Changes";


  document
    .getElementById(
      "cancelEditBtn"
    )
    .style.display =
      "block";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================
   PRODUCT BUTTONS
========================= */

function setupProductButtons() {

  const saveProductBtn =
    document.getElementById(
      "saveProductBtn"
    );


  if (saveProductBtn) {

    saveProductBtn.addEventListener(
      "click",
      saveProduct
    );

  }


  const cancelEditBtn =
    document.getElementById(
      "cancelEditBtn"
    );


  if (cancelEditBtn) {

    cancelEditBtn.addEventListener(
      "click",
      function() {

        resetForm();

      }
    );

  }

}


/* =========================
   ADD / UPDATE PRODUCT
========================= */

async function saveProduct() {

  const name =
    document
      .getElementById(
        "productName"
      )
      .value
      .trim();


  const priceValue =
    document
      .getElementById(
        "productPrice"
      )
      .value;


  const stockValue =
    document
      .getElementById(
        "productStock"
      )
      .value;


  const category =
    document
      .getElementById(
        "productCategory"
      )
      .value;


  const description =
    document
      .getElementById(
        "productDescription"
      )
      .value
      .trim();


  const message =
    document.getElementById(
      "message"
    );


  const saveButton =
    document.getElementById(
      "saveProductBtn"
    );


  const price =
    Number(priceValue);


  const stock =
    Number(stockValue);


  if (
  !name ||
  priceValue === "" ||
  !Number.isFinite(price) ||
  price < 0 ||
  stockValue === "" ||
  !Number.isInteger(stock) ||
  stock < 0 ||
  uploadedImages.length === 0 ||
  !description
) {

    message.innerText =
      "⚠️ সব তথ্য পূরণ করুন। Stock 0 বা তার বেশি হতে হবে।";

    message.style.color =
      "red";

    return;

  }


  try {

    saveButton.disabled =
      true;


    saveButton.innerText =
      editingProductId
        ? "⏳ Update হচ্ছে..."
        : "⏳ Save হচ্ছে...";


    message.innerText =
      "💾 Firebase-এ Save হচ্ছে...";


    message.style.color =
      "#ff6b00";


    if (editingProductId) {

      const productRef =
        doc(
          db,
          "products",
          editingProductId
        );


      await updateDoc(
        productRef,
        {

          name:
            name,

          price:
            price,

          stock:
            stock,

          image: uploadedImages[0],
images: uploadedImages,

          category:
            category,

          description:
            description

        }
      );


      message.innerText =
        "✅ Product সফলভাবে Update হয়েছে!";

    } else {

      await addDoc(
        collection(
          db,
          "products"
        ),
        {

          name:
            name,

          price:
            price,

          stock:
            stock,

          image: uploadedImages[0],
images: uploadedImages,

          category:
            category,

          description:
            description

        }
      );


      message.innerText =
        "✅ Product এবং Image সফলভাবে Save হয়েছে!";

    }


    message.style.color =
      "green";


    resetForm();


    await loadProducts();


  } catch (error) {

    console.error(
      "Save/Update error:",
      error
    );


    message.innerText =
      "❌ Error: " +
      error.message;


    message.style.color =
      "red";


  } finally {

    saveButton.disabled =
      false;

  }

}


/* =========================
   RESET FORM
========================= */

function resetForm() {

  editingProductId =
    null;


  uploadedImages = [];


  document
    .getElementById(
      "productName"
    )
    .value =
      "";


  document
    .getElementById(
      "productPrice"
    )
    .value =
      "";


  document
    .getElementById(
      "productStock"
    )
    .value =
      "";


  document
    .getElementById(
      "productDescription"
    )
    .value =
      "";


  document
    .getElementById(
      "productCategory"
    )
    .value =
      "fashion";


  const preview =
    document.getElementById(
      "imagePreview"
    );


  preview.src = "";

  preview.style.display =
    "none";


  const imageStatus =
    document.getElementById(
      "imageStatus"
    );


  imageStatus.innerText =
    "কোনো নতুন ছবি নির্বাচন করা হয়নি";


  imageStatus.style.color =
    "black";


  const editMode =
    document.getElementById(
      "editMode"
    );


  if (editMode) {

    editMode.style.display =
      "none";

  }


  document
    .getElementById(
      "saveProductBtn"
    )
    .innerText =
      "➕ Add Product";


  document
    .getElementById(
      "cancelEditBtn"
    )
    .style.display =
      "none";

}


/* =========================
   LOAD CUSTOMER ORDERS
========================= */

async function loadOrders() {

  const ordersList =
    document.getElementById(
      "ordersList"
    );


  if (!ordersList) {

    console.error(
      "ordersList পাওয়া যায়নি"
    );

    return;

  }


  ordersList.innerHTML =
    "⏳ Orders loading...";


  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "orders"
        )
      );


    ordersList.innerHTML =
      "";


    if (snapshot.empty) {

      ordersList.innerHTML =
        "<p>📭 এখনো কোনো Customer Order নেই।</p>";

      return;

    }


    snapshot.forEach(
      function(orderDoc) {

        const order =
          orderDoc.data();


        const item =
          document.createElement(
            "div"
          );


        item.className =
          "product-item";


        let orderItems =
          "";


        if (
          Array.isArray(
            order.items
          )
        ) {

          order.items.forEach(
            function(product) {

              orderItems += `

                <div style="
                  margin-top:6px;
                  padding:6px;
                  background:white;
                  border-radius:6px;
                ">

                  ${product.name || "Product"}

                  × ${product.quantity || 1}

                  ${
                    product.size &&
                    product.size !== "প্রযোজ্য নয়"
                      ? " | Size: " +
                        product.size
                      : ""
                  }

                </div>

              `;

            }
          );

        }


        let orderTime =
          "সময় পাওয়া যায়নি";


        if (
          order.createdAt &&
          typeof order.createdAt.toDate ===
            "function"
        ) {

          orderTime =
            order.createdAt
              .toDate()
              .toLocaleString("bn-BD");

        }


        item.innerHTML = `

          <div class="product-info">

            <b>
              🧾 Order #${
                order.orderNumber ||
                orderDoc.id
              }
            </b>

            <span>
              👤 Customer:
              ${
                order.customerName ||
                "নাম নেই"
              }
            </span>

            <span>
              📞 Phone:
              ${
                order.phone ||
                "নেই"
              }
            </span>

            <span>
              📍 Address:
              ${
                order.address ||
                "নেই"
              }
            </span>

            <span>
              💰 Total:
              ৳${order.total || 0}
            </span>

            <span>
              🕐 ${orderTime}
            </span>

            <div style="margin-top:10px;">

              <b>
                🛍️ Products:
              </b>

              ${orderItems}

            </div>

            <label style="
              margin-top:12px;
              display:block;
            ">

              Order Status

            </label>

            <select
              class="order-status"
              style="margin-top:5px;"
            >

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

          </div>

        `;


        ordersList.appendChild(
          item
        );


        const statusSelect =
          item.querySelector(
            ".order-status"
          );


        statusSelect.value =
          order.status ||
          "Pending";

const deleteBtn = document.createElement("button");
deleteBtn.innerText = "🗑️ Delete Order";
deleteBtn.type = "button";
deleteBtn.style.background = "#d32f2f";
deleteBtn.style.marginTop = "10px";

deleteBtn.addEventListener("click", function () {
  deleteOrder(orderDoc.id, order.orderNumber || orderDoc.id);
});


        /* =========================
           WHATSAPP CUSTOMER
        ========================= */

        const whatsappBtn =
          document.createElement(
            "button"
          );


        whatsappBtn.innerText =
          "💬 WhatsApp Customer";


        whatsappBtn.type =
          "button";


        whatsappBtn.style.background =
          "#25D366";


        whatsappBtn.style.marginTop =
          "10px";


        whatsappBtn.addEventListener(
          "click",
          function() {

            const phone =
              String(
                order.phone ||
                ""
              )
                .replace(
                  /\D/g,
                  ""
                );


            if (!phone) {

              alert(
                "❌ Customer phone number পাওয়া যায়নি।"
              );

              return;

            }


            let whatsappPhone =
              phone;


            if (
              whatsappPhone.startsWith(
                "01"
              )
            ) {

              whatsappPhone =
                "880" +
                whatsappPhone.substring(
                  1
                );

            }


            const customerName =
              String(
                order.customerName ||
                "Customer"
              );


            const orderId =
              String(
                order.orderNumber ||
                order.orderId ||
                orderDoc.id ||
                "UNKNOWN"
              );


            const status =
              String(
                statusSelect.value ||
                order.status ||
                "Pending"
              );


            const message =
              "Hello " +
              customerName +
              "!\n\n" +

              "🛍️ YOUR TREND\n" +

              "📋 Order ID: " +
              orderId +
              "\n" +

              "📦 Order Status: " +
              status +
              "\n\n" +

              "Thank you for shopping with us! ❤️";


            const whatsappURL =
              "https://wa.me/" +
              whatsappPhone +
              "?text=" +
              encodeURIComponent(
                message
              );


            window.open(
              whatsappURL,
              "_blank"
            );

          }
        );item.querySelector(".product-info").appendChild(whatsappBtn);
item.querySelector(".product-info").appendChild(deleteBtn);


        /* =========================
           ORDER STATUS
        ========================= */

        statusSelect.addEventListener(
          "change",
          async function() {

            try {

              await updateDoc(
                doc(
                  db,
                  "orders",
                  orderDoc.id
                ),
                {
                  status:
                    statusSelect.value
                }
              );


              await setDoc(
                doc(
                  db,
                  "orderTracking",
                  order.orderNumber ||
                    orderDoc.id
                ),
                {

                  orderNumber:
                    order.orderNumber ||
                    orderDoc.id,

                  status:
                    statusSelect.value

                },
                {
                  merge:
                    true
                }
              );


              alert(
                "✅ Order Status Update হয়েছে!"
              );


            } catch (error) {

              console.error(
                error
              );


              alert(
                "❌ Status Update করতে সমস্যা হয়েছে:\n" +
                error.message
              );

            }

          }
        );

      }
    );


  } catch (error) {

    console.error(
      "Orders load error:",
      error
    );


    ordersList.innerHTML = `

      <p style="color:red;">
        ❌ Orders load করতে সমস্যা হয়েছে।
      </p>

      <p style="color:#777;font-size:13px;">
        ${error.message}
      </p>

    `;

  }

          }

async function deleteOrder(orderId, orderNumber) {
  const ok = confirm("এই Order ডিলিট করবেন?");
  if (!ok) return;

  try {
    await deleteDoc(doc(db, "orders", orderId));
    await deleteDoc(doc(db, "orderTracking", orderNumber));

    alert("✅ Order Delete হয়েছে");
    loadOrders();

  } catch (e) {
    alert("❌ Delete হয়নি: " + e.message);
  }
}

