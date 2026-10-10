/* =========================================
   YOUR TREND — CUSTOMER ACCOUNT SYSTEM
========================================= */

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
   setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =========================================
   FIREBASE CONFIG
========================================= */

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


/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app =
  getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const db =
  getFirestore(app);


/* =========================================
   ELEMENTS
========================================= */

const loginForm =
  document.getElementById("loginForm");

const signupForm =
  document.getElementById("signupForm");

const forgotForm =
  document.getElementById("forgotForm");

// A direct visit to the login page should not reuse an old page destination.
if (!new URLSearchParams(window.location.search).get("returnTo")) {
  sessionStorage.removeItem("yourTrendNextPage");
}

function goToStoreAfterLogin() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("returnTo");
  const fromStorage = sessionStorage.getItem("yourTrendNextPage");
  const candidate = fromUrl || fromStorage;
  sessionStorage.removeItem("yourTrendNextPage");

  // Only return to a safe page on this same website.
  if (candidate) {
    try {
      const target = new URL(candidate, window.location.origin);
      const customerPath = new URL("customer.html", window.location.href).pathname;

      if (
        target.origin === window.location.origin &&
        target.pathname !== customerPath &&
        !target.pathname.endsWith("/customer.html")
      ) {
        window.location.replace(
          target.pathname + target.search + target.hash
        );
        return;
      }
    } catch (error) {
      console.warn("Invalid return destination; opening home page.", error);
    }
  }

  window.location.replace("index.html");
}

/* =========================================
   LOGIN
========================================= */

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async function (e) {

      e.preventDefault();

      const email =
        document.getElementById(
          "loginEmail"
        ).value.trim();

      const password =
        document.getElementById(
          "loginPassword"
        ).value;


      if (!email || !password) {

        alert(
          "Please enter your email and password."
        );

        return;
      }


      try {
await setPersistence(auth, browserLocalPersistence);
        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );


        console.log(
          "Customer logged in:",
          userCredential.user.uid
        );


      
goToStoreAfterLogin();

      } catch (error) {

        console.error(
          "Login error:",
          error
        );


        if (
          error.code ===
          "auth/invalid-credential"
        ) {

          alert(
            "Email or password is incorrect."
          );

        } else if (
          error.code ===
          "auth/user-not-found"
        ) {

          alert(
            "No account found with this email."
          );

        } else if (
          error.code ===
          "auth/wrong-password"
        ) {

          alert(
            "Incorrect password."
          );

        } else {

          alert(
            "Login failed. Please try again."
          );

        }

      }

    }
  );

}


/* =========================================
   SIGN UP
========================================= */

if (signupForm) {

  signupForm.addEventListener(
    "submit",
    async function (e) {

      e.preventDefault();


      const name =
        document.getElementById(
          "signupName"
        ).value.trim();

      const email =
        document.getElementById(
          "signupEmail"
        ).value.trim();

      const phone =
        document.getElementById(
          "signupPhone"
        ).value.trim();

      const password =
        document.getElementById(
          "signupPassword"
        ).value;

      const confirmPassword =
        document.getElementById(
          "signupConfirmPassword"
        ).value;


      /* -------------------------
         VALIDATION
      ------------------------- */

      if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
      ) {

        alert(
          "Please fill in all fields."
        );

        return;
      }


      if (password.length < 6) {

        alert(
          "Password must be at least 6 characters."
        );

        return;
      }


      if (
        password !==
        confirmPassword
      ) {

        alert(
          "Passwords do not match."
        );

        return;
      }


      try {

        // Keep the customer signed in across browser restarts.
        await setPersistence(auth, browserLocalPersistence);

        /* -------------------------
           CREATE FIREBASE USER
        ------------------------- */

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        const user =
          userCredential.user;


        /* -------------------------
           SAVE CUSTOMER PROFILE
        ------------------------- */

        await setDoc(
          doc(
            db,
            "customers",
            user.uid
          ),
          {

            uid:
              user.uid,

            name:
              name,

            email:
              email,

            phone:
              phone,

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp()

          }
        );


        console.log(
          "Customer profile created:",
          user.uid
        );


        alert(
          "YOUR TREND account created successfully!"
        );


        goToStoreAfterLogin();


      } catch (error) {

        console.error(
          "Signup error:",
          error
        );


        if (
          error.code ===
          "auth/email-already-in-use"
        ) {

          alert(
            "This email already has an account."
          );

        } else if (
          error.code ===
          "auth/invalid-email"
        ) {

          alert(
            "Please enter a valid email address."
          );

        } else if (
          error.code ===
          "auth/weak-password"
        ) {

          alert(
            "Password is too weak."
          );

        } else {

  alert(
    "Signup Error:\n\n" +
    error.code +
    "\n\n" +
    error.message
  );

        }

      }

    }
  );

}


/* =========================================
   FORGOT PASSWORD
========================================= */

if (forgotForm) {

  forgotForm.addEventListener(
    "submit",
    async function (e) {

      e.preventDefault();


      const email =
        document.getElementById(
          "forgotEmail"
        ).value.trim();


      if (!email) {

        alert(
          "Please enter your email address."
        );

        return;
      }


      try {

        await sendPasswordResetEmail(
          auth,
          email
        );


        alert(
          "Password reset email has been sent."
        );


        window.location.href =
          "customer.html";


      } catch (error) {

        console.error(
          "Password reset error:",
          error
        );


        if (
          error.code ===
          "auth/user-not-found"
        ) {

          alert(
            "No account found with this email."
          );

        } else {

          alert(
            "Could not send password reset email."
          );

        }

      }

    }
  );

}


/* =========================================
   CHECK LOGIN STATE
========================================= */

onAuthStateChanged(
  auth,
  async function (user) {

    if (!user) {

      console.log(
        "No customer is logged in."
      );

      return;
    }


    console.log(
      "Logged-in customer:",
      user.uid
    );


    try {

      const customerRef =
        doc(
          db,
          "customers",
          user.uid
        );

      const customerSnap =
        await getDoc(
          customerRef
        );


      if (
        customerSnap.exists()
      ) {

        console.log(
          "Customer profile:",
          customerSnap.data()
        );

      }

    } catch (error) {

      console.error(
        "Could not load customer profile:",
        error
      );

    }

  }
);


/* =========================================
   LOGOUT
========================================= */

window.logoutCustomer =
  async function () {

    try {

      await signOut(auth);


      alert(
        "You have been logged out."
      );


      window.location.href =
        "index.html";


    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      alert(
        "Logout failed."
      );

    }

  };
