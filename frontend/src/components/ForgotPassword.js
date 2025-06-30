import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { getEmailFromUsername } from "../utility/FirebaseHelpers";
import styles from "../styles/Login"; // Reuse existing styling

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigation = useNavigation();

  const startCooldown = () => {
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResetPassword = async () => {
    if (!identifier) {
      Alert.alert("Missing Field", "Please enter your username or email.");
      return;
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
      await sendPasswordResetEmail(auth, emailToUse);
      setShowResetPopup(true);
      setCooldown(30);
      startCooldown();
    } catch (error) {
      Alert.alert("Error", "Failed to send password reset email.");
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
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Icon name="arrow-back" size={26} color="#8986a7" />
          </TouchableOpacity>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              marginTop: -26,
            }}
          >
            <Text style={[styles.title, { fontSize: 40, marginBottom: 15 }]}>
              Forgot Password
            </Text>

            <Text style={[styles.subtitle, { marginBottom: 15 }]}>
              Please enter your username or email to reset the password.
            </Text>

            <TextInput
              placeholder="Email or Username"
              placeholderTextColor="#8986a7"
              style={[styles.input, { width: "100%" }]}
              value={identifier}
              onChangeText={setIdentifier}
            />

            <TouchableOpacity
              style={[styles.button, { width: "100%" }]}
              onPress={handleResetPassword}
            >
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {showResetPopup && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
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
            <Text
              style={{
                fontSize: 18,
                color: "#fff",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              A password reset link has been sent to your email.
            </Text>

            <Text
              style={{ color: "#ccc", textAlign: "center", marginBottom: 10 }}
            >
              Didn’t receive it?{" "}
              <Text
                onPress={handleResetPassword}
                style={{
                  color: cooldown > 0 ? "#888" : "#cf59a9",
                  fontWeight: "bold",
                }}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
              </Text>
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 10 }}
            >
              <Text
                style={{
                  color: "#cf59a9",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Continue to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default ForgotPassword;
