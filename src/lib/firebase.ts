import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkvSpDQ7oLbjTQXRDmngzk8KJN_2wHkZM",
  authDomain: "tab4-5a611.firebaseapp.com",
  projectId: "tab4-5a611",
  storageBucket: "tab4-5a611.appspot.com",
  messagingSenderId: "750779374697",
  appId: "1:750779374697:web:651a17f1620c98cabad6f8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
