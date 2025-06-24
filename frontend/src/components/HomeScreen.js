import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/HomeScreen";
import FrogLogo from "../../assets/frog-logo.png";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={["#04060c", "#1a0e2a"]} // Replace with your desired gradient colors
      style={styles.gradientContainer}
    >
      <Text style={styles.title}>
        LOCK <Text style={styles.titleBold}>IN</Text>
      </Text>
      <Image source={FrogLogo} style={styles.logo} />
      <Text style={styles.subtitle}>Welcome back. Stay focused.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
