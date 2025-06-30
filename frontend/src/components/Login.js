import React, { useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEmailFromUsername } from "../utility/FirebaseHelpers"
import styles from "../styles/Login"; // Reuse the same styles

const Login = () => {
    const [identifier, setIdentifier] = useState(""); // email or username
    const [password, setPassword] = useState("");
    const [showVerifyPopup, setShowVerifyPopup] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [verificationSuccess, setVerificationSuccess] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        if (!showVerifyPopup) return;

        const interval = setInterval(async () => {
            await auth.currentUser?.reload();
            if (auth.currentUser?.emailVerified) {
                clearInterval(interval);
                setVerificationSuccess(true);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [showVerifyPopup]);

    const handleResendEmail = async () => {
        if (auth.currentUser && cooldown === 0) {
            try {
                await sendEmailVerification(auth.currentUser);
                setCooldown(30);
                const interval = setInterval(() => {
                    setCooldown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } catch (err) {
                Alert.alert("Error", "Could not resend verification email.");
            }
        }
    };

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
                emailToUse = await getEmailFromUsername(identifier);
            } catch (error) {
                Alert.alert("Error", error.message);
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
                setShowVerifyPopup(true);
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
                            style={[styles.input, { marginBottom: 2 }]}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="#8986a7"
                        />

                        <TouchableOpacity
                            onPress={() => navigation.navigate("ForgotPassword")}
                            style={{ alignSelf: "flex-end", marginBottom: 15 }}
                        >
                            <Text style={[styles.link, { fontSize: 13 }]}>Forgot password?</Text>
                        </TouchableOpacity>

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

            {showVerifyPopup && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.8)", // dark transparent background
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#1e1e2d",
                            padding: 25,
                            borderRadius: 12,
                            width: "85%",
                            alignItems: "center",
                        }}
                    >
                        {verificationSuccess ? (
                            <>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: "#fff",
                                        marginBottom: 20,
                                        textAlign: "center",
                                    }}
                                >
                                    Your email has been verified!
                                </Text>
                                <Icon
                                    name={"check-circle"}
                                    size={40}
                                    color={"#cf59a9"}
                                    solid={false}
                                    style={{ marginBottom: 20 }}
                                />
                                <Text
                                    style={{
                                        color: "#aaa",
                                        fontSize: 14,
                                        marginBottom: 5,
                                        textAlign: "center",
                                    }}
                                >
                                    Thank you for verifying please sign in again.
                                </Text>
                                <TouchableOpacity onPress={() => setShowVerifyPopup(false)}>
                                    <Text
                                        style={{
                                            color: "#cf59a9",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Continue to Login
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: "#fff",
                                        marginBottom: 20,
                                        textAlign: "center",
                                    }}
                                >
                                    You must verify your email to continue.
                                </Text>
                                <ActivityIndicator
                                    size="large"
                                    color="#cf59a9"
                                    style={{ marginBottom: 20 }}
                                />

                                <Text
                                    style={{
                                        color: "#aaa",
                                        fontSize: 14,
                                        marginBottom: 5,
                                        textAlign: "center",
                                    }}
                                >
                                    A verification email has been sent to your inbox.
                                </Text>
                                <Text style={{ color: "#ccc", textAlign: "center" }}>
                                    Didn't receive an email?{" "}
                                    <Text
                                        onPress={handleResendEmail}
                                        style={{
                                            color: cooldown > 0 ? "#888" : "#cf59a9",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
                                    </Text>
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            )}
        </>
    );
};

export default Login;
