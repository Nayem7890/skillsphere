// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAE9t_t6-CzlEq82VWkLvD0laudJDBNp3A",
  authDomain: "online-learning-platform-b0b50.firebaseapp.com",
  projectId: "online-learning-platform-b0b50",
  storageBucket: "online-learning-platform-b0b50.firebasestorage.app",
  messagingSenderId: "54565586287",
  appId: "1:54565586287:web:98f8b67eaac393611b949a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);