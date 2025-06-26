const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./firebaseAccountKey.json");
const mockData = JSON.parse(fs.readFileSync("./admin-mock-data.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function importData() {
  const { goals, tasks } = mockData;

  for (const goal of goals) {
    await db.collection("goals").doc(goal.id).set(goal);
  }

  for (const task of tasks) {
    await db.collection("tasks").doc(task.id).set(task);
  }

  console.log("✅ Import complete!");
}

importData().catch((error) => {
  console.error("❌ Error importing data:", error);
});
