if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

const { admin, auth, db } = require("../firebase");
const { Timestamp } = admin.firestore;
const { faker } = require("@faker-js/faker");

const NUM_TASKS = 20;
const NUM_GOALS = 10;
const NUM_GOAL_TASKS = 5;

// Returns a due date in the past or future (±10 days), and a creation date before it
function generateDueAndCreatedTimestamps(daysRange = 10, maxGapDays = 7) {
    const now = new Date();

    // Pick a creation date within the past `daysRange`
    const createdDate = faker.date.between({
        from: new Date(now.getTime() - daysRange * 24 * 60 * 60 * 1000),
        to: now,
    });

    // Pick a due date up to `maxGapDays` after the creation date
    const dueDate = faker.date.between({
        from: createdDate,
        to: new Date(createdDate.getTime() + maxGapDays * 24 * 60 * 60 * 1000),
    });

    return {
        createdAt: Timestamp.fromDate(createdDate),
        dueAt: Timestamp.fromDate(dueDate),
    };
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
        const { dueAt, createdAt } = generateDueAndCreatedTimestamps();

        const goal = {
            id: faker.string.uuid(),
            userId: adminUID,
            title: faker.lorem.words(3),
            dueAt,
            createdAt,
        };

        await db.collection("goals").doc(goal.id).set(goal);
        console.log(`Added goal: ${goal.id}`);

        for (let j = 0; j < NUM_GOAL_TASKS; j++) {
            const { dueAt, createdAt } = generateDueAndCreatedTimestamps();

            const task = {
                id: faker.string.uuid(),
                goalId: goal.id,
                userId: adminUID,
                title: faker.lorem.words(3),
                priority: faker.helpers.arrayElement(["High", "Medium", "Low"]),
                completed: Math.random() < 0.5,
                dueAt,
                createdAt,
            };

            await db.collection("tasks").doc(task.id).set(task);
        }
    }
}

async function addTasks(adminUID) {
    for (let i = 0; i < NUM_TASKS; i++) {
        const { dueAt, createdAt } = generateDueAndCreatedTimestamps();

        const task = {
            id: faker.string.uuid(),
            userId: adminUID,
            title: faker.lorem.words(3),
            priority: faker.helpers.arrayElement(["High", "Medium", "Low"]),
            completed: Math.random() < 0.5,
            dueAt,
            createdAt,
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
