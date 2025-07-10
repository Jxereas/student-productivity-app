import { db, auth } from "../firebase/firebaseConfig";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import {
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendEmailVerification,
} from "firebase/auth";

// Gets the logged in user
export const getLoggedInUser = async () => {
    if (__DEV__) {
        await signInWithEmailAndPassword(auth, "admin@gmail.com", "administrator");
    }

    return auth.currentUser;
};

// Sign out the logged in user
export const signOutLoggedInUser = async () => {
    await signOut(auth);
};

// Reauthenticates the current user with their password
export const reauthenticateUser = async (password) => {
    try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
    } catch (error) {
        if (error.code === "auth/wrong-password") {
            throw new Error("Incorrect password, please try again.");
        } else {
            throw new Error(`Reauthentication failed.`);
        }
    }
};

// Changes the user's email in both Firebase Auth and Firestore
export const changeUserEmail = async (newEmail, password) => {
    try {
        await reauthenticateUser(password);

        const user = auth.currentUser;
        const userDocRef = doc(db, "users", user.uid);

        await updateDoc(userDocRef, { email: newEmail });
        await updateEmail(user, newEmail);
        await sendEmailVerification(user);
    } catch (error) {
        if (
            error.message.includes("Reauthentication") ||
            error.message.includes("Incorrect password")
        ) {
            throw error;
        }

        throw new Error(`Email update failed.`);
    }
};

// Changes the user's password in Firebase Auth
export const changeUserPassword = async (newPassword, password) => {
    try {
        await reauthenticateUser(password);
        await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
        if (
            error.message.includes("Reauthentication") ||
            error.message.includes("Incorrect password")
        ) {
            throw error;
        }

        throw new Error(`Password update failed.`);
    }
};

// Get user document for the logged in user
export const getUserDocumentFromFirestore = async () => {
    if (__DEV__) {
        await signInWithEmailAndPassword(auth, "admin@gmail.com", "administrator");
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return userDocSnap.data();
        } else {
            throw new Error("Invalid User: user document does not exist.");
        }
    } catch (error) {
        console.error(error.message);
        throw new Error("Failed to fetch user document.");
    }
};

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

        throw new Error("Failed to look up username.");
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

// Updates a single task
export const updateTaskInFirestore = async (taskId, updates) => {
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

        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, updates);
    } catch (error) {
        throw new Error(`Failed to edit task.`);
    }
};

// Updates multiple tasks
export const updateMultipleTasksInFirestore = async (tasksToUpdate) => {
    try {
        for (const task of tasksToUpdate) {
            const { id, updates } = task;
            await updateTaskInFirestore(id, updates);
        }
    } catch (error) {
        throw new Error(`Failed to update multiple tasks: ${error.message}`);
    }
};

// Updates a single goal
export const updateGoalInFirestore = async (goalId, updates) => {
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

        const goalRef = doc(db, "goals", goalId);
        await updateDoc(goalRef, updates);
    } catch (error) {
        console.error(error.message);
        throw new Error("Failed to edit goal.");
    }
};

// Updates multiple goals
export const updateMultipleGoalsInFirestore = async (goalsToUpdate) => {
    try {
        for (const goal of goalsToUpdate) {
            const { id, updates } = goal;
            await updateGoalInFirestore(id, updates);
        }
    } catch (error) {
        throw new Error(`Failed to edit multiple goals.`);
    }
};

// Adds a single goal
export const addGoalToFirestore = async (title, dueDateTime) => {
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

// Sets specified task to completed or uncompleted and checks if it has an associated goal and sets to complete if needed
export const setTaskCompleted = async (task, completed) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const taskRef = doc(db, "tasks", task.id);
        await updateDoc(taskRef, { completed });

        if (task.goalId) {
            const q = query(
                collection(db, "tasks"),
                where("userId", "==", user.uid),
                where("goalId", "==", task.goalId),
            );

            const snapshot = await getDocs(q);
            const tasks = snapshot.docs.map((doc) => doc.data());

            const allCompleted = tasks.every((t) => t.completed === true);

            const goalRef = doc(db, "goals", task.goalId);
            await updateDoc(goalRef, { completed: allCompleted });
        }
    } catch (error) {
        throw new Error("Failed to complete task and update goal.");
    }
};

// Sets specified goal and all subtasks to completed or uncompleted
export const setGoalCompleted = async (goal, completed) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const goalRef = doc(db, "goals", goal.id);
        await updateDoc(goalRef, { completed });

        const q = query(
            collection(db, "tasks"),
            where("userId", "==", user.uid),
            where("goalId", "==", goal.id),
        );

        const taskSnapshot = await getDocs(q);

        const updates = taskSnapshot.docs.map((docSnap) => {
            const taskRef = doc(db, "tasks", docSnap.id);
            return updateDoc(taskRef, { completed });
        });

        await Promise.all(updates);
    } catch (error) {
        throw new Error("Failed to update goal and its tasks.");
    }
};

// Deletes the specified task
export const deleteTask = async (task) => {
    try {
        const taskRef = doc(db, "tasks", task.id);
        await deleteDoc(taskRef);
    } catch (error) {
        throw new Error("Failed to delete task.");
    }
};

// Deletes the specified goal
export const deleteGoal = async (goalId) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const q = query(
            collection(db, "tasks"),
            where("userId", "==", user.uid),
            where("goalId", "==", goalId),
        );

        const taskSnapshot = await getDocs(q);

        const deletions = taskSnapshot.docs.map((docSnap) => {
            const taskRef = doc(db, "tasks", docSnap.id);
            return deleteDoc(taskRef);
        });

        await Promise.all(deletions);

        const goalRef = doc(db, "goals", goalId);
        await deleteDoc(goalRef);
    } catch (error) {
        throw new Error("Failed to delete goal and linked tasks.");
    }
};

// Fetches all tasks (subtasks) linked to a specific goal ID
export const getSubtasksByGoalId = async (goalId) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const q = query(
            collection(db, "tasks"),
            where("userId", "==", user.uid),
            where("goalId", "==", goalId),
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        throw new Error("Failed to fetch subtasks for the goal.");
    }
};
