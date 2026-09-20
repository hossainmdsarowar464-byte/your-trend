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


const firebaseConfig = {
  apiKey: "AIzaSyAfYg-SdoKLFGuEtzFZdqwpqHRRdEuiuQI",
  authDomain: "your-trend.firebaseapp.com",
  projectId: "your-trend",
  storageBucket: "your-trend.firebasestorage.app",
  messagingSenderId: "775017944976",
  appId: "1:775017944976:web:a19b34b89e6a4285148515",
  measurementId: "G-1T4GM19268"
};


// Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// Cloudinary
const CLOUDINARY_CLOUD_NAME = "fq6ele9x";

const CLOUDINARY_UPLOAD_PRESET = "your_trend_products";


// Login ছাড়া Admin Panel-এ ঢুকতে দেওয়া হবে না
onAuthStateChanged(auth, function (user) {

  if (!user) {
    window.location.href = "admin-login.html";
  }

});


// Logout
document.getElementById("logoutBtn").addEventListener("click", async function () {

  try {

    await signOut(auth);

    window.location.href = "admin-login.html";

  } catch (error) {

    console.error(error);

  }

});


// Image preview
document.getElementById("productImage").addEventListener("change", function () {

  const file = this.files[0];

  const preview = document.getElementById("imagePreview");

  if (!file) {

    preview.style.display = "none";
    preview.src = "";

    return;

  }


  if (!file.type.startsWith("image/")) {

    alert("শুধু image file নির্বাচন করুন।");

    this.value = "";

    preview.style.display = "none";

    return;

  }


  // 5 MB limit
  if (file.size > 5 * 1024 * 1024) {

    alert("ছবির size সর্বোচ্চ 5 MB হতে হবে।");

    this.value = "";

    preview.style.display = "none";

    return;

  }


  const imageURL = URL.createObjectURL(file);

  preview.src = imageURL;

  preview.style.display = "block";

});


// Add Product
document.getElementById("saveProductBtn").addEventListener("click", async function () {

  const name =
    document.getElementById("productName").value.trim();

  const price =
    document.getElementById("productPrice").value;

  const imageFile =
    document.getElementById("productImage").files[0];

  const category =
    document.getElementById("productCategory").value;

  const description =
    document.getElementById("productDescription").value.trim();

  const message =
    document.getElementById("message");

  const saveButton =
    document.getElementById("saveProductBtn");


  // Validation
  if (!name || !price || !imageFile || !description) {

    message.innerText = "⚠️ সব তথ্য পূরণ করুন এবং একটি ছবি নির্বাচন করুন।";

    message.style.color = "red";

    return;

  }


  if (imageFile.size > 5 * 1024 * 1024) {

    message.innerText = "⚠️ ছবির size সর্বোচ্চ 5 MB হতে হবে।";

    message.style.color = "red";

    return;

  }


  try {

    saveButton.disabled = true;

    saveButton.innerText = "⏳ Image Upload হচ্ছে...";

    message.innerText = "📤 ছবি Upload হচ্ছে...";

    message.style.color = "#ff6b00";


    // Cloudinary upload
    const formData = new FormData();

    formData.append("file", imageFile);

    formData.append(
      "upload_preset",
      CLOUDINARY_UPLOAD_PRESET
    );


    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );


    if (!cloudinaryResponse.ok) {

      throw new Error("Cloudinary image upload failed.");

    }


    const cloudinaryData =
      await cloudinaryResponse.json();


    const imageURL =
      cloudinaryData.secure_url;


    // Save product to Firestore
    saveButton.innerText = "💾 Product Save হচ্ছে...";

    message.innerText = "💾 Firebase-এ Product Save হচ্ছে...";


    await addDoc(collection(db, "products"), {

      name: name,

      price: Number(price),

      image: imageURL,

      category: category,

      description: description

    });


    message.innerText =
      "✅ Product এবং Image সফলভাবে Save হয়েছে!";

    message.style.color = "green";


    // Clear form
    document.getElementById("productName").value = "";

    document.getElementById("productPrice").value = "";

    document.getElementById("productImage").value = "";

    document.getElementById("productDescription").value = "";

    document.getElementById("imagePreview").style.display = "none";

    document.getElementById("imagePreview").src = "";


  } catch (error) {

    console.error(error);

    message.innerText =
      "❌ Error: " + error.message;

    message.style.color = "red";


  } finally {

    saveButton.disabled = false;

    saveButton.innerText = "➕ Add Product";

  }

});
