const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { db } = require("./firebase");
require("dotenv").config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/signup", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "Missing fields." });
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = await db.collection("users").add({
      email: email,
      username: username,
      password: hashedPassword,
      profilePicture: "", // can be updated later
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "User created", id: userRef.id });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Failed to create user." });
  }
});

app.get("/test", (req, res) => {
  res.send("Backend is reachable!");
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
