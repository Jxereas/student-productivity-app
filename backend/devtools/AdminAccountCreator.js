if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

const { admin, auth, db } = require("../firebase");

const email = "admin@gmail.com";
const password = "administrator";
const displayName = "admin";

async function createUserDocument(uid, email, username) {
    const userDoc = {
        email,
        username,
        createdAt: new Date().toISOString(), // matches your string format
    };

    await db.collection("users").doc(uid).set(userDoc);
    console.log(`Firestore document created for user: ${username}`);
}

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

        // Ensure Firestore doc exists
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (!userDoc.exists) {
            await createUserDocument(user.uid, user.email, displayName);
        } else {
            console.log("Firestore user document already exists.");
        }

        process.exit(0);
    })
    .catch(async (error) => {
        if (error.code === "auth/user-not-found") {
            try {
                const newUser = await admin.auth().createUser({
                    email,
                    password,
                    displayName,
                    emailVerified: true,
                });

                console.log(`Created and verified user: ${newUser.email}`);
                await createUserDocument(newUser.uid, email, displayName);
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
