if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

const { admin, db } = require("../firebase");

async function transferUserData(sourceEmail, targetEmail) {
    try {
        // Get UIDs
        const sourceUser = await admin.auth().getUserByEmail(sourceEmail);
        const targetUser = await admin.auth().getUserByEmail(targetEmail);

        const sourceUID = sourceUser.uid;
        const targetUID = targetUser.uid;

        console.log(`Transferring data from ${sourceEmail} → ${targetEmail}`);
        console.log(`Source UID: ${sourceUID}`);
        console.log(`Target UID: ${targetUID}`);

        // Transfer Goals
        const goalsSnapshot = await db
            .collection("goals")
            .where("userId", "==", sourceUID)
            .get();

        for (const doc of goalsSnapshot.docs) {
            await doc.ref.update({ userId: targetUID });
            console.log(`✔️  Moved goal ${doc.id}`);
        }

        // Transfer Tasks
        const tasksSnapshot = await db
            .collection("tasks")
            .where("userId", "==", sourceUID)
            .get();

        for (const doc of tasksSnapshot.docs) {
            await doc.ref.update({ userId: targetUID });
            console.log(`✔️  Moved task ${doc.id}`);
        }

        console.log("\n✅ Transfer complete!");
    } catch (err) {
        console.error("❌ Transfer failed:", err);
    }
}

// Replace with your source and target emails
transferUserData("admin@gmail.com", "john@gmail.com");

