import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCngKXfPkno5okYknDCgN0tuYHMRdOrOWM",
  authDomain: "student-productivity-app-a5e28.firebaseapp.com",
  projectId: "student-productivity-app-a5e28",
  storageBucket: "student-productivity-app-a5e28.firebasestorage.app",
  messagingSenderId: "783085439265",
  appId: "1:783085439265:web:20eda210403a51ecbf5660"

};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
