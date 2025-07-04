import { db, auth } from "../firebase/firebaseConfig";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

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

// Adds a single task
export const addTaskToFirestore = async (
    title,
    priority,
    dueDateTime,
    goalId = null,
) => {
    try {
        if (__DEV__) {
            await signInWithEmailAndPassword(
                auth,
                "admin@gmail.com",
                "administrator",
            );
        }

        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const taskData = {
            userId: user.uid,
            title: title.trim(),
            priority,
            completed: false,
            createdAt: serverTimestamp(),
            dueAt: dueDateTime,
        };

        if (goalId) {
            taskData.goalId = goalId;
        }

        const newTaskRef = await addDoc(collection(db, "tasks"), taskData);

        await updateDoc(newTaskRef, { id: newTaskRef.id });
    } catch (error) {
        throw new Error(`Failed to add task: ${error.message}`);
    }
};

// Adds multiple tasks
export const addMultipleTasksToFirestore = async (tasks) => {
    for (const task of tasks) {
        await addTaskToFirestore(
            task.title,
            task.priority,
            task.dueDateTime,
            task.goalId,
        );
    }
};

// Adds a single goal
export const addGoalToFirestore = async (title, dueDateTime) => {
    try {
        if (__DEV__) {
            await signInWithEmailAndPassword(auth, "admin@gmail.com", "administrator");
        }

        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const goalData = {
            userId: user.uid,
            title: title.trim(),
            createdAt: serverTimestamp(),
            dueAt: dueDateTime,
        };

        const newGoalRef = await addDoc(collection(db, "goals"), goalData);

        await updateDoc(newGoalRef, { id: newGoalRef.id });

        return newGoalRef.id; // Return the ID so tasks can be grouped under it
    } catch (error) {
        throw new Error(`Failed to add goal: ${error.message}`);
    }
};

// Adds multiple goals
export const addMultipleGoalsToFirestore = async (goals) => {
    const goalIds = [];
    for (const goal of goals) {
        const goalId = await addGoalToFirestore(goal.title, goal.dueDateTime);
        goalIds.push(goalId);
    }
    return goalIds;
};

// Gets all tasks
export const getAllTasksFromFirestore = async () => {
    try {
        if (__DEV__) {
            await signInWithEmailAndPassword(
                auth,
                "admin@gmail.com",
                "administrator",
            );
        }

        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            ...doc.data(),
        }));
    } catch (error) {
        throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
};

// Get all goals
export const getAllGoalsFromFirestore = async () => {
    try {
        if (__DEV__) {
            await signInWithEmailAndPassword(
                auth,
                "admin@gmail.com",
                "administrator",
            );
        }

        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const q = query(collection(db, "goals"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            ...doc.data(),
        }));
    } catch (error) {
        throw new Error(`Failed to fetch goals: ${error.message}`);
    }
};
