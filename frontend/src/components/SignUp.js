import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/SignUp";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!email) {
      Alert.alert("Missing email field", "Please fill in all fields.");
      return;
    }

    if (!password) {
      Alert.alert("Missing password field", "Please fill in all fields.");
      return;
    }

    if (!username) {
      Alert.alert("Missing username field", "Please fill in all fields.");
      return;
    }

    if (!confirmedPassword) {
      Alert.alert(
        "Missing confirmed password field",
        "Please fill in all fields.",
      );
      return;
    }

    if (username.length > 15) {
      Alert.alert(
        "Username Too Long",
        "Username must be 15 characters or fewer.",
      );
      return;
    }

    if (password.length > 25) {
      Alert.alert(
        "Password Too Long",
        "Password must be 25 characters or fewer.",
      );
      return;
    }

    if (password !== confirmedPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:3001/api/signup", {
        // This is the android studio emulator parent device ip
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await sendEmailVerification(userCredential.user);

      Alert.alert(
        "Success",
        "Account created! Please check your email to verify.",
      );
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Signup</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#8986a7"
        />

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
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

        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          secureTextEntry
          value={confirmedPassword}
          onChangeText={setConfirmedPassword}
          placeholderTextColor="#8986a7"
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Already have an account?</Text>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;
