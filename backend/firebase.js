const admin = require("firebase-admin");

const serviceAccountPath =
    process.env.NODE_ENV === "production"
        ? "/etc/secrets/firebaseAccountKey"
        : "./firebaseAccountKey.json";

const serviceAccount = require(serviceAccountPath);

if (process.env.NODE_ENV === "development") {
    const path = require("path");

    require("dotenv").config({
        path: path.resolve(__dirname, ".env.development"),
    });

    if (process.env.FIREBASE_USE_EMULATORS === "true") {
        process.env.FIRESTORE_EMULATOR_HOST =
            process.env.LOCAL_FIRESTORE_EMULATOR_HOST;
        process.env.FIREBASE_AUTH_EMULATOR_HOST =
            process.env.LOCAL_FIREBASE_AUTH_EMULATOR_HOST;
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
