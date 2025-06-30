if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

const {admin, auth, db } = require("../firebase")
const path = require("path");
const fs = require("fs");

const mockData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./AdminMockData.json"), "utf8"));

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
      await db.collection("goals").doc(goal.id).set(goal);
      console.log(`Added goal: ${goal.id}`);
    }

    for (const task of mockData.tasks) {
      task.userId = adminUID;
      await db.collection("tasks").doc(task.id).set(task);
      console.log(`Added task: ${task.id}`);
    }

    console.log("\nImport complete!");
  } catch (err) {
    console.error("Failed to import data:", err);
  }
}

importData();
