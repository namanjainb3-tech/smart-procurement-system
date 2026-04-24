import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNxe_e4Tb-8MmodzVXw6rTxu1DFR6PTVg",
  authDomain: "smart-procurement-161a7.firebaseapp.com",
  projectId: "smart-procurement-161a7",
  storageBucket: "smart-procurement-161a7.firebasestorage.app",
  messagingSenderId: "234403297413",
  appId: "1:234403297413:web:c5fef2d3fab521aabcd1ec",
  measurementId: "G-TFS54D2QG7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export default app;