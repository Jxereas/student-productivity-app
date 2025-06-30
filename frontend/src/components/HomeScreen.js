import React from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/HomeScreen";
import FrogLogo from "../../assets/frog-logo.png";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={["#04060c", "#1a0e2a"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView edges={["top"]} style={{ flex: 0 }}>
        <StatusBar barStyle="light-content" backgroundColor="#04060c" />
      </SafeAreaView>

      <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
        <View style={styles.container}>
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
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
