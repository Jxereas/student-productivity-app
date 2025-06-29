if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

const {admin, auth, db } = require("../firebase")

const email = "admin@gmail.com";
const password = "administrator";
const displayName = "admin";

admin
  .auth()
  .getUserByEmail(email)
  .then(async (user) => {
    console.log(`User already exists: ${user.email}`);
    if (!user.emailVerified) {
      await admin.auth().updateUser(user.uid, { emailVerified: true });
      console.log("Email verified.");
    } else {
      console.log("Email already verified.");
    }
    process.exit(0);
  })
  .catch(async (error) => {
    if (error.code === "auth/user-not-found") {
      // Create the user
      try {
        const newUser = await admin.auth().createUser({
          email,
          password,
          displayName,
          emailVerified: true, // Set to true on creation
        });
        console.log(`Created and verified user: ${newUser.email}`);
        process.exit(0);
      } catch (createError) {
        console.error("Error creating user:", createError);
        process.exit(1);
      }
    } else {
      console.error("Error fetching user:", error);
      process.exit(1);
    }
  });
