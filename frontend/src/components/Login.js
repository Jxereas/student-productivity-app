import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/Login"; // Reuse the same styles

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!identifier) {
      Alert.alert("Missing Field", "Please enter a username or email.");
      return;
    }

    if (!password) {
      Alert.alert("Missing Field", "Please enter a password.");
    }

    let emailToUse = identifier;

    if (!identifier.includes("@")) {
      try {
        const q = query(
          collection(db, "users"),
          where("username", "==", identifier),
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          Alert.alert("Invalid Username", "Please enter a valid username.");
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (!userData.email) {
          Alert.alert("Error", "No email associated with this username.");
          return;
        }
        emailToUse = userData.email;
      } catch (error) {
        Alert.alert("Error", "Failed to look up username");
        return;
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        password,
      );

      if (!userCredential.user.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in.",
        );
        return;
      }

      // Proceed with navigation if needed
      Alert.alert("Success", "Login successful!");
    } catch (error) {
      let message = "Please try again.";
      if (error.code === "auth/user-not-found") {
        message = "No user found with that email.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format.";
      }

      Alert.alert("Login Failed", message);
    }
  };

  return (
    <>
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 0, backgroundColor: "#04060c" }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#04060c" />
      </SafeAreaView>

      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{ flex: 1, backgroundColor: "#04060c" }}
      >
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Login</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              placeholder="Email or Username"
              style={styles.input}
              value={identifier}
              onChangeText={setIdentifier}
              placeholderTextColor="#8986a7"
            />

            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#8986a7"
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>Don't have an account?</Text>

            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Login;
