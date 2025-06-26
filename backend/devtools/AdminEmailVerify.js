// verifyAdminUser.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseAccountKey.json"); // path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const emailToVerify = "admin@gmail.com";

admin.auth().getUserByEmail(emailToVerify)
  .then(user => {
    return admin.auth().updateUser(user.uid, {
      emailVerified: true,
    });
  })
  .then(userRecord => {
    console.log(`Successfully marked ${userRecord.email} as verified.`);
    process.exit(0);
  })
  .catch(error => {
    console.error("Error:", error);
    process.exit(1);
  });
