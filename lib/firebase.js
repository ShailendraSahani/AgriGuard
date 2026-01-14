// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPSVk6aan9Mte0qPww7Cpx0tzayQIZfrw",
  authDomain: "agriguard-218f5.firebaseapp.com",
  projectId: "agriguard-218f5",
  storageBucket: "agriguard-218f5.firebasestorage.app",
  messagingSenderId: "788297548454",
  appId: "1:788297548454:web:f854d7361f2d736e4bea67",
  measurementId: "G-MYWW4K2LSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);