import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSNLFpZITpaT0x7VGdq62brcjWvjRJTIc",
  authDomain: "clone-9286d.firebaseapp.com",
  projectId: "clone-9286d",
  storageBucket: "clone-9286d.appspot.com",
  messagingSenderId: "560051290624",
  appId: "1:560051290624:web:b778eb4e8331d51eb70ee5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
