const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccountPath =
  process.env.NODE_ENV === "production"
    ? "/etc/secrets/firebaseAccountKey"
    : path.resolve(__dirname, "./firebaseAccountKey.json");

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

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
