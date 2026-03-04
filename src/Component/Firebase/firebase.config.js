// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1PhvsQcpru1K4Yk6a9koPwUOU9-MjvrI",
  authDomain: "garments-management-app.firebaseapp.com",
  projectId: "garments-management-app",
  storageBucket: "garments-management-app.firebasestorage.app",
  messagingSenderId: "538980888906",
  appId: "1:538980888906:web:45d324fa75eb83b60651b3",
  measurementId: "G-SK48YC860R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;