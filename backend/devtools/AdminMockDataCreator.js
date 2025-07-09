if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

const { admin, auth, db } = require("../firebase");
const { Timestamp } = admin.firestore;

const path = require("path");
const fs = require("fs");

const mockData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./AdminMockData.json"), "utf8"),
);

// Combine "dueDate" and "dueTime" into a JS Date object, refactor fix from previous formated data to new timestamp
function giveDateRandomTime(dueDateStr) {
    let hours = 12;
    let minutes = 0;
    hours = Math.floor(Math.random() * 24); // 0 to 23
    minutes = Math.floor(Math.random() / 0.25) * 15; // 0, 15, 30, 45

    const [year, month, day] = dueDateStr.split("-").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
}

async function clearEmulatorData() {
    const goalsSnapshot = await db.collection("goals").get();
    for (const doc of goalsSnapshot.docs) {
        await doc.ref.delete();
    }

    const tasksSnapshot = await db.collection("tasks").get();
    for (const doc of tasksSnapshot.docs) {
        await doc.ref.delete();
    }

    console.log("Cleared old emulator data\n");
}

async function importData() {
    try {
        // Get the current admin user UID
        const userRecord = await admin.auth().getUserByEmail("admin@gmail.com");
        const adminUID = userRecord.uid;

        await clearEmulatorData();

        for (const goal of mockData.goals) {
            goal.userId = adminUID;
            goal.completed = Math.random() < 0.5;
            goal.dueAt = Timestamp.fromDate(giveDateRandomTime(goal.dueDate));
            goal.createdAt = Timestamp.fromDate(
                giveDateRandomTime(goal.creationDate),
            );

            delete goal.dueDate;
            delete goal.creationDate;

            await db.collection("goals").doc(goal.id).set(goal);
            console.log(`Added goal: ${goal.id}`);
        }

        for (const task of mockData.tasks) {
            task.userId = adminUID;
            task.completed = Math.random() < 0.5;
            task.dueAt = Timestamp.fromDate(giveDateRandomTime(task.dueDate));
            task.createdAt = Timestamp.fromDate(
                giveDateRandomTime(task.creationDate),
            );

            delete task.dueDate;
            delete task.creationDate;

            await db.collection("tasks").doc(task.id).set(task);
            console.log(`Added task: ${task.id}`);
        }

        console.log("\nImport complete!");
    } catch (err) {
        console.error("Failed to import data:", err);
    }
}

importData();
