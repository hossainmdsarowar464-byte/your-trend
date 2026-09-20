import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ===============================
// Firebase Configuration
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyAfYg-SdoKLFGuEtzFZdqwpqHRRdEuiuQI",
  authDomain: "your-trend.firebaseapp.com",
  projectId: "your-trend",
  storageBucket: "your-trend.firebasestorage.app",
  messagingSenderId: "775017944976",
  appId: "1:775017944976:web:a19b34b89e6a4285148515",
  measurementId: "G-1T4GM19268"
};


// ===============================
// Firebase Start
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ===============================
// Cloudinary
// ===============================

const CLOUDINARY_CLOUD_NAME = "fq6ele9x";

const CLOUDINARY_UPLOAD_PRESET = "your_trend_products";


// ===============================
// Variables
// ===============================

let uploadedImageURL = "";


// ===============================
// Admin Login Protection
// ===============================

onAuthStateChanged(auth, function (user) {

  if (!user) {

    window.location.href = "admin-login.html";

  }

});


// ===============================
// Logout
// ===============================

document
  .getElementById("logoutBtn")
  .addEventListener("click", async function () {

    try {

      await signOut(auth);

      window.location.href = "admin-login.html";

    } catch (error) {

      console.error(error);

    }

  });


// ===============================
// Cloudinary Upload Widget
// ===============================

let uploadWidget = null;

function setupCloudinaryWidget() {

  if (typeof cloudinary === "undefined") {

    console.error("Cloudinary Widget load হয়নি।");

    document.getElementById("imageStatus").innerText =
      "❌ Cloudinary Widget load হয়নি";

    document.getElementById("imageStatus").style.color =
      "red";

    return;

  }


  uploadWidget = cloudinary.createUploadWidget(

    {
      cloudName: CLOUDINARY_CLOUD_NAME,

      uploadPreset: CLOUDINARY_UPLOAD_PRESET,

      sources: ["local"],

      multiple: false,

      maxFiles: 1,

      resourceType: "image",

      clientAllowedFormats: [
        "jpg",
        "jpeg",
        "png",
        "webp"
      ],

      maxFileSize: 5000000
    },

    function (error, result) {

      if (error) {

        console.error("Cloudinary Error:", error);

        document.getElementById("imageStatus").innerText =
          "❌ Image upload failed";

        document.getElementById("imageStatus").style.color =
          "red";

        return;
      }


      if (
        result &&
        result.event === "success"
      ) {

        uploadedImageURL =
          result.info.secure_url;


        const preview =
          document.getElementById("imagePreview");

        preview.src =
          uploadedImageURL;

        preview.style.display =
          "block";


        const imageStatus =
          document.getElementById("imageStatus");

        imageStatus.innerText =
          "✅ Image successfully uploaded";

        imageStatus.style.color =
          "green";


        console.log(
          "Uploaded Image:",
          uploadedImageURL
        );

      }

    }

  );

}


// Wait until page is ready
window.addEventListener(
  "load",
  setupCloudinaryWidget
);


// ===============================
// Select Product Image
// ===============================

document
  .getElementById("selectImageBtn")
  .addEventListener("click", function () {

    if (!uploadWidget) {

      alert(
        "Cloudinary এখনও প্রস্তুত হয়নি। ২-৩ সেকেন্ড পরে আবার চাপুন।"
      );

      setupCloudinaryWidget();

      return;

    }

    uploadWidget.open();

  });


// ===============================
// Add Product
// ===============================

document
  .getElementById("saveProductBtn")
  .addEventListener("click", async function () {


    const name =
      document
        .getElementById("productName")
        .value
        .trim();


    const price =
      document
        .getElementById("productPrice")
        .value;


    const category =
      document
        .getElementById("productCategory")
        .value;


    const description =
      document
        .getElementById("productDescription")
        .value
        .trim();


    const message =
      document.getElementById("message");


    const saveButton =
      document.getElementById("saveProductBtn");


    // ===============================
    // Validation
    // ===============================

    if (
      !name ||
      !price ||
      !uploadedImageURL ||
      !description
    ) {

      message.innerText =
        "⚠️ সব তথ্য পূরণ করুন এবং একটি ছবি নির্বাচন করুন।";

      message.style.color =
        "red";

      return;

    }


    try {

      saveButton.disabled = true;

      saveButton.innerText =
        "⏳ Product Save হচ্ছে...";


      message.innerText =
        "💾 Firebase-এ Product Save হচ্ছে...";

      message.style.color =
        "#ff6b00";


      // ===============================
      // Save Product to Firestore
      // ===============================

      await addDoc(
        collection(db, "products"),
        {

          name: name,

          price: Number(price),

          image: uploadedImageURL,

          category: category,

          description: description

        }
      );


      // ===============================
      // Success
      // ===============================

      message.innerText =
        "✅ Product এবং Image সফলভাবে Save হয়েছে!";

      message.style.color =
        "green";


      // Clear Product Name
      document
        .getElementById("productName")
        .value = "";


      // Clear Price
      document
        .getElementById("productPrice")
        .value = "";


      // Clear Description
      document
        .getElementById("productDescription")
        .value = "";


      // Clear Image
      uploadedImageURL = "";


      document
        .getElementById("imagePreview")
        .src = "";


      document
        .getElementById("imagePreview")
        .style.display = "none";


      document
        .getElementById("imageStatus")
        .innerText =
        "কোনো ছবি নির্বাচন করা হয়নি";


      document
        .getElementById("imageStatus")
        .style.color =
        "black";


    } catch (error) {

      console.error(error);


      message.innerText =
        "❌ Error: " + error.message;


      message.style.color =
        "red";


    } finally {

      saveButton.disabled = false;

      saveButton.innerText =
        "➕ Add Product";

    }

  });
