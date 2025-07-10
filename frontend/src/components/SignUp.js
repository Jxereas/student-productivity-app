import React, { useRef, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
    sendEmailVerification,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import Alert from "./Alert";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/SignUp";
import { API_BASE_URL } from "@env";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [username, setUsername] = useState("");

    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

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
            const response = await fetch(`${API_BASE_URL}/api/signup`, {
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
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={80}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
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
                                    keyboardAppearance="dark"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    textContentType="emailAddress"
                                    autoCorrect={true}
                                    returnKeyType="next"
                                    onSubmitEditing={() => usernameInputRef.current?.focus()}
                                />

                                <TextInput
                                    placeholder="Username"
                                    style={styles.input}
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholderTextColor="#8986a7"
                                    ref={usernameInputRef}
                                    keyboardAppearance="dark"
                                    returnKeyType="next"
                                    textContentType="username"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                                />

                                <TextInput
                                    placeholder="Password"
                                    style={styles.input}
                                    secureTextEntry
                                    keyboardAppearance="dark"
                                    autoCapitalize="none"
                                    textContentType="password"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholderTextColor="#8986a7"
                                    ref={passwordInputRef}
                                    onSubmitEditing={() =>
                                        confirmPasswordInputRef.current?.focus()
                                    }
                                />

                                <TextInput
                                    placeholder="Confirm Password"
                                    style={styles.input}
                                    secureTextEntry
                                    keyboardAppearance="dark"
                                    autoCapitalize="none"
                                    textContentType="password"
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    value={confirmedPassword}
                                    onChangeText={setConfirmedPassword}
                                    placeholderTextColor="#8986a7"
                                    ref={confirmPasswordInputRef}
                                    onSubmitEditing={handleSignUp}
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
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

export default SignUp;
