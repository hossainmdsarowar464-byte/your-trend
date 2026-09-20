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
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =========================
   FIREBASE
========================= */

const firebaseConfig = {

  apiKey: "AIzaSyAfYg-SdoKLFGuEtzFZdqwpqHRRdEuiuQI",

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

let uploadedImageURL = "";

let editingProductId = null;

let uploadWidget = null;


/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(
  auth,
  function(user) {

    if (!user) {

      window.location.href =
        "admin-login.html";

      return;

    }

    loadProducts();

  }
);


/* =========================
   LOGOUT
========================= */

document
  .getElementById("logoutBtn")
  .addEventListener(
    "click",
    async function() {

      try {

        await signOut(auth);

        window.location.href =
          "admin-login.html";

      } catch (error) {

        console.error(error);

        alert(
          "Logout করতে সমস্যা হয়েছে: " +
          error.message
        );

      }

    }
  );


/* =========================
   CLOUDINARY WIDGET
========================= */

function setupCloudinaryWidget() {

  if (
    typeof cloudinary ===
    "undefined"
  ) {

    console.error(
      "Cloudinary Widget load হয়নি"
    );

    document
      .getElementById(
        "imageStatus"
      )
      .innerText =
        "❌ Cloudinary load হয়নি";

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
          5000000

      },

      function(error, result) {

        if (error) {

          console.error(
            "Cloudinary Error:",
            error
          );

          document
            .getElementById(
              "imageStatus"
            )
            .innerText =
              "❌ Image upload failed";

          return;

        }


        if (
          result &&
          result.event ===
            "success"
        ) {

          uploadedImageURL =
            result.info.secure_url;


          const preview =
            document.getElementById(
              "imagePreview"
            );

          preview.src =
            uploadedImageURL;

          preview.style.display =
            "block";


          const status =
            document.getElementById(
              "imageStatus"
            );

          status.innerText =
            "✅ নতুন Image নির্বাচন করা হয়েছে";

          status.style.color =
            "green";

        }

      }

    );

}


window.addEventListener(
  "load",
  setupCloudinaryWidget
);


/* =========================
   SELECT IMAGE
========================= */

document
  .getElementById(
    "selectImageBtn"
  )
  .addEventListener(
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


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

  const productList =
    document.getElementById(
      "productList"
    );


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
            src="${product.image || ""}"
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
   EDIT PRODUCT
========================= */

function editProduct(
  productId,
  product
) {

  editingProductId =
    productId;


  document
    .getElementById(
      "editMode"
    )
    .style.display =
      "block";


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


  /*
    পুরোনো Image রাখা হবে
  */

  uploadedImageURL =
    product.image || "";


  const preview =
    document.getElementById(
      "imagePreview"
    );


  if (uploadedImageURL) {

    preview.src =
      uploadedImageURL;

    preview.style.display =
      "block";

  } else {

    preview.src = "";

    preview.style.display =
      "none";

  }


  document
    .getElementById(
      "imageStatus"
    )
    .innerText =
      "✅ আগের Image ব্যবহার করা হবে";


  document
    .getElementById(
      "imageStatus"
    )
    .style.color =
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
   ADD / UPDATE PRODUCT
========================= */

document
  .getElementById(
    "saveProductBtn"
  )
  .addEventListener(
    "click",
    async function() {

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


      /* VALIDATION */

      if (
        !name ||
        priceValue === "" ||
        !Number.isFinite(price) ||
        price < 0 ||
        stockValue === "" ||
        !Number.isInteger(stock) ||
        stock < 0 ||
        !uploadedImageURL ||
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


        /* =================
           EDIT EXISTING
        ================= */

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

              image:
                uploadedImageURL,

              category:
                category,

              description:
                description

            }
          );


          message.innerText =
            "✅ Product সফলভাবে Update হয়েছে!";

        }


        /* =================
           ADD NEW
        ================= */

        else {

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

              image:
                uploadedImageURL,

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


        /* FORM RESET */

        resetForm();


        /* PRODUCT LIST REFRESH */

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
  );


/* =========================
   CANCEL EDIT
========================= */

document
  .getElementById(
    "cancelEditBtn"
  )
  .addEventListener(
    "click",
    function() {

      resetForm();

    }
  );


/* =========================
   RESET FORM
========================= */

function resetForm() {

  editingProductId =
    null;


  uploadedImageURL =
    "";


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


  document
    .getElementById(
      "imageStatus"
    )
    .innerText =
      "কোনো নতুন ছবি নির্বাচন করা হয়নি";


  document
    .getElementById(
      "imageStatus"
    )
    .style.color =
      "black";


  document
    .getElementById(
      "editMode"
    )
    .style.display =
      "none";


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
