if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

const { admin, db } = require("../firebase");
const { Timestamp } = admin.firestore;
const fs = require("fs");
const path = require("path");

// Load mock data JSON
const mockData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./LockInSeedData.json"), "utf8"),
);

// Converts a JS Date string to a Firestore Timestamp
function toTimestamp(dateStr) {
    return Timestamp.fromDate(new Date(dateStr));
}

// Deletes all documents in `goals` and `tasks` collections
async function clearEmulatorData() {
    const goalsSnapshot = await db.collection("goals").get();
    for (const doc of goalsSnapshot.docs) {
        await doc.ref.delete();
    }

    const tasksSnapshot = await db.collection("tasks").get();
    for (const doc of tasksSnapshot.docs) {
        await doc.ref.delete();
    }

    console.log("✅ Cleared old emulator data");
}

// Imports goals and tasks into Firestore
// // Imports goals and tasks into Firestore
async function importData() {
    try {
        const userRecord = await admin.auth().getUserByEmail("admin@gmail.com");
        const adminUID = userRecord.uid;

        await clearEmulatorData();

        // Step 1: Import all goals and keep track of their Firestore IDs
        const goalTitleToId = new Map();
        const goalIdToRef = new Map();

        for (const goal of mockData.goals) {
            const ref = await db.collection("goals").add({
                ...goal,
                title: goal.Title,
                userId: adminUID,
                createdAt: toTimestamp(goal.createdAt),
                dueAt: toTimestamp(goal.dueAt),
                completed: false, // We'll update this later
            });
            await db.collection("goals").doc(ref.id).update({ id: ref.id });

            goalTitleToId.set(goal.Title.toLowerCase(), ref.id);
            goalIdToRef.set(ref.id, ref);
            console.log(`➕ Added goal: ${goal.Title}`);
        }

        // Step 2: Import tasks and group them by goalId
        const goalTasksMap = new Map();

        for (const task of mockData.tasks) {
            let title = task.Title;
            let goalId = null;

            // Match subtasks like "Goal Name - Subtask 3"
            const subtaskMatch = title.match(/^(.*)\s-\sSubtask\s\d+$/i);
            if (subtaskMatch) {
                const baseTitle = subtaskMatch[1].trim().toLowerCase();
                goalId = goalTitleToId.get(baseTitle);
                title = subtaskMatch[1];
            }

            const completed = Math.random() < 0.5;

            const ref = await db.collection("tasks").add({
                ...task,
                title,
                goalId: goalId || null,
                userId: adminUID,
                completed,
                createdAt: toTimestamp(task.createdAt),
                dueAt: toTimestamp(task.dueAt),
            });
            await db.collection("tasks").doc(ref.id).update({ id: ref.id });

            // Group by goalId for later goal completion check
            if (goalId) {
                if (!goalTasksMap.has(goalId)) {
                    goalTasksMap.set(goalId, []);
                }
                goalTasksMap.get(goalId).push(completed);
            }

            console.log(`➕ Added task: ${title}`);
        }

        // Step 3: Update goals with completion status
        for (const [goalId, completionStates] of goalTasksMap.entries()) {
            const isGoalComplete = completionStates.every((done) => done);
            await goalIdToRef.get(goalId).update({ completed: isGoalComplete });
            console.log(
                `✔️  Goal ${goalId} marked as ${isGoalComplete ? "complete" : "incomplete"}`,
            );
        }

        console.log("\n✅ Import complete!");
    } catch (err) {
        console.error("❌ Failed to import data:", err);
    }
}

importData();
