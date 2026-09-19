import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("saveProductBtn").addEventListener("click", async function () {

  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value;
  const image = document.getElementById("productImage").value.trim();
  const category = document.getElementById("productCategory").value;
  const description = document.getElementById("productDescription").value.trim();
  const message = document.getElementById("message");

  if (!name || !price || !image || !description) {
    message.innerText = "⚠️ সব তথ্য পূরণ করুন";
    message.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "products"), {
      name: name,
      price: Number(price),
      image: image,
      category: category,
      description: description
    });

    message.innerText = "✅ Product Firebase-এ Save হয়েছে";
    message.style.color = "green";

    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("productDescription").value = "";

  } catch (error) {
    console.error(error);
    message.innerText = "❌ Product Save হয়নি";
    message.style.color = "red";
  }

});
