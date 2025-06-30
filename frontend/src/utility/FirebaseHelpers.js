import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Resolves an email from a given identifier (either email or username).
 */
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
        throw new Error("Firebase Error: Failed to look up username.");
    }
};
