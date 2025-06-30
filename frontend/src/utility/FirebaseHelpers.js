import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

// Resolves an email from a given identifier (either email or username)
export const getEmailFromUsername = async (identifier) => {
  try {
    const q = query(
      collection(db, "users"),
      where("username", "==", identifier),
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("Invalid Username: Please enter a valid username.");
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.email) {
      throw new Error("Invalid Email: No email associated with this username.");
    }
    return userData.email;
  } catch (error) {
    if (
      error.message.includes("Invalid Username") ||
      error.message.includes("Invalid Email")
    ) {
      throw error;
    }

    throw new Error("Firebase Error: Failed to look up username.");
  }
};

// Fetch all goals for a specific user
export const getAllUserGoals = async (userId) => {
  try {
    const goalsRef = collection(db, "goals");
    const q = query(goalsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const goals = [];
    querySnapshot.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() });
    });

    return goals;
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
};

// Fetch all tasks for a specific user
export const getAllUserTasks = async (userId) => {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};
