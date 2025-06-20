# Student Productivity App

A mobile app built with **React Native**, **Firebase**, and **Node.js** to help students manage long-term academic goals by organizing them into actionable tasks with visual progress tracking.

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

3. Start the Expo development server:
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

4. Start the backend server:
    ```bash
    node index.js
    ```

The server will run at http://localhost:3001/
