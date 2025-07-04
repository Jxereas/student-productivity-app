if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

const { admin, auth, db } = require("../firebase");
const { Timestamp } = admin.firestore;
const { faker } = require("@faker-js/faker");

const NUM_TASKS = 20;
const NUM_GOALS = 10;
const NUM_GOAL_TASKS = 5;

// Generates a Date object offset by days from now and random time
function randomFutureOrPastDate(daysRange = 10) {
    const base = new Date();
    const offset = Math.floor(Math.random() * daysRange * 2) - daysRange;
    base.setDate(base.getDate() + offset);

    // Add random hours and minutes
    base.setHours(Math.floor(Math.random() * 24));
    base.setMinutes(Math.floor(Math.random() / 0.25) * 15);
    return base;
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

async function addGoals(adminUID) {
    for (let i = 0; i < NUM_GOALS; i++) {
        const dueAt = randomFutureOrPastDate();
        const createdAt = randomFutureOrPastDate(7);

        const goal = {
            id: faker.string.uuid(),
            userId: adminUID,
            title: faker.lorem.words(3),
            dueAt: Timestamp.fromDate(dueAt),
            createdAt: Timestamp.fromDate(createdAt),
        };

        await db.collection("goals").doc(goal.id).set(goal);
        console.log(`Added goal: ${goal.id}`);

        for (let j = 0; j < NUM_GOAL_TASKS; j++) {
            const dueAt = randomFutureOrPastDate();
            const createdAt = randomFutureOrPastDate(7);

            const task = {
                id: faker.string.uuid(),
                goalId: goal.id,
                userId: adminUID,
                title: faker.lorem.words(3),
                priority: faker.helpers.arrayElement(["High", "Medium", "Low"]),
                completed: Math.random() < 0.5,
                dueAt: Timestamp.fromDate(dueAt),
                createdAt: Timestamp.fromDate(createdAt),
            };

            await db.collection("tasks").doc(task.id).set(task);
        }
    }
}

async function addTasks(adminUID) {
    for (let i = 0; i < NUM_TASKS; i++) {
        const dueAt = randomFutureOrPastDate();
        const createdAt = randomFutureOrPastDate(7);

        const task = {
            id: faker.string.uuid(),
            userId: adminUID,
            title: faker.lorem.words(3),
            priority: faker.helpers.arrayElement(["High", "Medium", "Low"]),
            completed: Math.random() < 0.5,
            dueAt: Timestamp.fromDate(dueAt),
            createdAt: Timestamp.fromDate(createdAt),
        };

        await db.collection("tasks").doc(task.id).set(task);
        console.log(`Added task: ${task.id}`);
    }
}

async function importData() {
    try {
        const userRecord = await admin.auth().getUserByEmail("admin@gmail.com");
        const adminUID = userRecord.uid;

        await clearEmulatorData();
        await addGoals(adminUID);
        await addTasks(adminUID);

        console.log("\nImport complete!");
    } catch (err) {
        console.error("Failed to import data:", err);
    }
}

importData();
