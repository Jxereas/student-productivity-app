const express = require("express");
const cors = require("cors");
const { db, auth, admin } = require("./firebase");
const axios = require("axios");
const ical = require("ical");

if (process.env.NODE_ENV === "development") {
    const path = require("path");

    require("dotenv").config({
        path: path.resolve(__dirname, ".env.development"),
    });
} else if (process.env.NODE_ENV === "production") {
    const path = require("path");

    require("dotenv").config({
        path: path.resolve(__dirname, ".env.production"),
    });
}

const isValidIcsUrl = (url) => /^https?:\/\/.+\.ics$/.test(url);

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/signup", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "Missing email." });
    }

    if (!username) {
        return res.status(400).json({ message: "Missing username." });
    }

    if (!password) {
        return res.status(400).json({ message: "Missing password." });
    }

    if (username.length > 15) {
        return res
            .status(400)
            .json({ message: "Username must be ≤ 15 characters." });
    }

    if (password.length > 25) {
        return res
            .status(400)
            .json({ message: "Password must be ≤ 25 characters." });
    }

    try {
        const usernameSnapshot = await db
            .collection("users")
            .where("username", "==", username)
            .get();

        if (!usernameSnapshot.empty) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const emailSnapshot = await db
            .collection("users")
            .where("email", "==", email)
            .get();

        if (!emailSnapshot.empty) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        let userRecord;
        try {
            // Create Firebase Auth user
            userRecord = await auth.createUser({
                email,
                password,
                displayName: username,
            });
        } catch (authError) {
            return res.status(400).json({ message: authError.message });
        }

        // Store additional data in Firestore
        await db.collection("users").doc(userRecord.uid).set({
            email,
            username,
            createdAt: new Date().toISOString(),
        });

        return res
            .status(201)
            .json({ message: "User created", uid: userRecord.uid });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Failed to create user." });
    }
});

app.post("/api/import-ics", async (req, res) => {
    const authHeader = req.headers.authorization;
    const { icsUrl } = req.body;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing token." });
    }

    const idToken = authHeader.split("Bearer ")[1];

    if (!icsUrl || !icsUrl.endsWith(".ics")) {
        return res.status(400).json({ error: "Invalid .ics URL." });
    }

    if (!icsUrl || typeof icsUrl !== "string") {
        return res.status(400).json({ error: "Missing .ics URL." });
    }

    const trimmedUrl = icsUrl.trim();

    if (trimmedUrl.length > 2048) {
        return res.status(400).json({ error: "URL is too long." });
    }

    if (!isValidIcsUrl(trimmedUrl)) {
        return res.status(400).json({ error: "Invalid .ics URL format." });
    }

    try {
        // Verify the token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Fetch and parse .ics data
        const response = await axios.get(trimmedUrl);
        const parsedData = ical.parseICS(response.data);

        // const batch = db.batch(); // Batch write for performance
        let count = 0;

        for (const k in parsedData) {
            const event = parsedData[k];
            if (event.type === "VEVENT" && event.start) {
                const eventDate = new Date(event.start);
                const now = new Date();

                if (eventDate < now) {
                    continue;
                }

                try {
                    const newTaskRef = db.collection("tasks").doc();

                    await newTaskRef.set({
                        id: newTaskRef.id,
                        userId: uid,
                        title: event.summary || "Untitled",
                        dueAt: admin.firestore.Timestamp.fromDate(new Date(event.start)),
                        priority: "Medium",
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        imported: true,
                    });
                    count++;
                } catch (err) {
                    console.error("Failed to add task:", err.message);
                }
            }
        }

        // await batch.commit();

        res.json({ importedCount: count });
    } catch (err) {
        console.error("Import ICS error:", err.message);
        res.status(500).json({ error: "Failed to import .ics data." });
    }
});

app.get("/test", (req, res) => {
    res.send("Backend is reachable!");
});

const PORT =
    process.env.NODE_ENV === "development"
        ? process.env.EXPRESS_PORT || 3001
        : process.env.PORT || 3001;

const HOST =
    process.env.NODE_ENV === "development"
        ? process.env.EXPRESS_HOST || "0.0.0.0"
        : undefined; // Don't specify host in production

// Start the server
app.listen(PORT, HOST, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});
