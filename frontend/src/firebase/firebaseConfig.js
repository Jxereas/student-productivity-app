import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence,
    connectAuthEmulator,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
    FIREBASE_USE_EMULATORS,
    FIREBASE_EMULATOR_HOST,
    FIREBASE_EMULATOR_FIRESTORE_PORT,
    FIREBASE_EMULATOR_AUTH_PORT,
} from "@env";

const firebaseConfig = {
    apiKey: "AIzaSyCngKXfPkno5okYknDCgN0tuYHMRdOrOWM",
    authDomain: "student-productivity-app-a5e28.firebaseapp.com",
    projectId: "student-productivity-app-a5e28",
    storageBucket: "student-productivity-app-a5e28.firebasestorage.app",
    messagingSenderId: "783085439265",
    appId: "1:783085439265:web:20eda210403a51ecbf5660",
};

const app = initializeApp(firebaseConfig);

let auth;
try {
    auth = getAuth(app);
} catch (e) {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
}

const db = getFirestore(app);

if (__DEV__) {
    console.log("Dev");
    if (FIREBASE_USE_EMULATORS === "true") {
        connectAuthEmulator(
            auth,
            `http://${FIREBASE_EMULATOR_HOST}:${FIREBASE_EMULATOR_AUTH_PORT}`,
        );
        connectFirestoreEmulator(
            db,
            FIREBASE_EMULATOR_HOST,
            FIREBASE_EMULATOR_FIRESTORE_PORT,
        );
    }
}

export { auth, db };
