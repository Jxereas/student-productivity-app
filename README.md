# Student Productivity App

A mobile app built with **React Native**, **Firebase**, and **Node.js** to help students manage long-term academic goals by organizing them into actionable tasks with visual progress tracking.

---

## Overview

This application allows students to create long-term academic goals, break them into tasks, and track progress over time. It supports authentication, real-time data synchronization, and calendar imports to help students manage their workload across platforms.

---

## Frontend Setup (React Native with Expo)

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a .env.development file in the frontend/ directory and add the following (replace with actual local ip):
    ```bash
    EXPRESS_HOST=0.0.0.0
    EXPRESS_PORT=3001

    FIREBASE_USE_EMULATORS=true
    FIREBASE_EMULATOR_HOST=LOCAL.IP.HERE
    FIREBASE_EMULATOR_FIRESTORE_PORT=8080
    FIREBASE_EMULATOR_AUTH_PORT=9099
    ```

4. Start the Expo development server:
    ```bash
    npx expo start
    ```

You can scan the QR code with the Expo Go app on your Android or iOS device, or run it using an emulator.

---

## Backend Setup (Node.js with Firebase)

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Add your Firebase service account key:

    - Go to https://console.firebase.google.com
    - Select the shared project
    - Go to Project Settings > Service Accounts
    - Click "Generate new private key"
    - Save the file as:

        firebaseAccountKey.json

    in the backend/ directory.

    Make sure to name it exactly "firebaseAccountKey.json" or name it something else and add it to the .gitignore, currently it is added to the .gitignore as that existing name.

4. Create a .env.development file in the backend/ directory and add the following (replace with actual local ip):
    ```bash
    EXPRESS_HOST=LOCAL.IP.HERE
    EXPRESS_PORT=3001

    FIREBASE_USE_EMULATORS=true
    LOCAL_FIRESTORE_EMULATOR_HOST=LOCAL.IP.HERE:8080
    LOCAL_FIREBASE_AUTH_EMULATOR_HOST=LOCAL.IP.HERE:9099
    ```

5. Start the backend server:
    ```bash
    npm run dev
    ```

The server will run at http://localhost:3001/

---

## Combined Running

1. Navigate to the root directory.

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the frontend and backend concurrently:
    ```bash
    npm run dev
    ```

---

## Notes

This project was originally developed as part of coursework at the University of Virginia.
