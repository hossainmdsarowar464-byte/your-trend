/* =====================================================
   YOUR TREND — CUSTOMER ACCOUNT SYSTEM
   Firebase Authentication + Firestore
===================================================== */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =====================================================
   FIREBASE CONFIG
===================================================== */

/*
   এখানে তোমার existing Firebase config বসাতে হবে।
*/

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain: "YOUR_PROJECT.firebaseapp.com",

  projectId: "YOUR_PROJECT_ID",

  storageBucket: "YOUR_PROJECT.firebasestorage.app",

  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

  appId: "YOUR_APP_ID"

};


/* =====================================================
   INITIALIZE FIREBASE
===================================================== */

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const db =
  getFirestore(app);


/* =====================================================
   CREATE CUSTOMER ACCOUNT
===================================================== */

const signupForm =
  document.getElementById("signupForm");


if (signupForm) {

  signupForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const name =
        document
          .getElementById("signupName")
          .value
          .trim();


      const email =
        document
          .getElementById("signupEmail")
          .value
          .trim();


      const phone =
        document
          .getElementById("signupPhone")
          .value
          .trim();


      const password =
        document
          .getElementById("signupPassword")
          .value;


      const confirmPassword =
        document
          .getElementById("signupConfirmPassword")
          .value;


      /* Password check */

      if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

      }


      if (password.length < 6) {

        alert(
          "Password must be at least 6 characters."
        );

        return;

      }


      try {

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        const user =
          userCredential.user;


        /* Save customer profile */

        await setDoc(
          doc(db, "customers", user.uid),
          {

            uid: user.uid,

            name: name,

            email: email,

            phone: phone,

            createdAt: serverTimestamp(),

            updatedAt: serverTimestamp()

          }
        );


        alert(
          "Your YOUR TREND account has been created successfully!"
        );


        /*
           Account created.
           Firebase automatically signs
           the customer in.
        */

        window.location.href =
          "customer.html";

      }

      catch (error) {

        console.error(
          "Signup Error:",
          error
        );


        if (
          error.code ===
          "auth/email-already-in-use"
        ) {

          alert(
            "This email is already registered. Please sign in."
          );

        }

        else if (
          error.code ===
          "auth/invalid-email"
        ) {

          alert(
            "Please enter a valid email address."
          );

        }

        else if (
          error.code ===
          "auth/weak-password"
        ) {

          alert(
            "Please choose a stronger password."
          );

        }

        else {

          alert(
            "Account creation failed. Please try again."
          );

        }

      }

    }
  );

}


/* =====================================================
   CUSTOMER LOGIN
===================================================== */

const loginForm =
  document.getElementById("loginForm");


if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const email =
        document
          .getElementById("loginEmail")
          .value
          .trim();


      const password =
        document
          .getElementById("loginPassword")
          .value;


      try {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );


        alert(
          "Welcome back to YOUR TREND!"
        );


        window.location.href =
          "customer.html";

      }

      catch (error) {

        console.error(
          "Login Error:",
          error
        );


        if (
          error.code ===
          "auth/invalid-credential"
        ) {

          alert(
            "Email or password is incorrect."
          );

        }

        else if (
          error.code ===
          "auth/invalid-email"
        ) {

          alert(
            "Please enter a valid email address."
          );

        }

        else {

          alert(
            "Login failed. Please try again."
          );

        }

      }

    }
  );

}


/* =====================================================
   FORGOT PASSWORD
===================================================== */

const forgotForm =
  document.getElementById("forgotForm");


if (forgotForm) {

  forgotForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const email =
        document
          .getElementById("forgotEmail")
          .value
          .trim();


      try {

        await sendPasswordResetEmail(
          auth,
          email
        );


        alert(
          "Password reset instructions have been sent to your email."
        );


        showLogin();

      }

      catch (error) {

        console.error(
          "Password Reset Error:",
          error
        );


        alert(
          "Unable to send reset email. Please check the email address."
        );

      }

    }
  );

}


/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(
  auth,
  async function (user) {

    if (!user) {

      console.log(
        "No customer is currently signed in."
      );

      return;

    }


    console.log(
      "Customer signed in:",
      user.uid
    );


    /*
       Customer profile exists in:

       customers
          └── user.uid
    */


    try {

      const customerRef =
        doc(
          db,
          "customers",
          user.uid
        );


      const customerSnapshot =
        await getDoc(customerRef);


      if (
        customerSnapshot.exists()
      ) {

        console.log(
          "Customer profile:",
          customerSnapshot.data()
        );

      }

    }

    catch (error) {

      console.error(
        "Profile Error:",
        error
      );

    }

  }
);


/* =====================================================
   LOGOUT FUNCTION
===================================================== */

window.logoutCustomer =
  async function () {

    try {

      await signOut(auth);


      alert(
        "You have been logged out."
      );


      window.location.href =
        "index.html";

    }

    catch (error) {

      console.error(
        "Logout Error:",
        error
      );

    }

  };
