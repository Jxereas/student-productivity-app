import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import Alert from "./Alert";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {
  getLoggedInUser,
  signOutLoggedInUser,
  getUserDocumentFromFirestore,
  changeUserEmail,
  changeUserPassword,
  getCurrentUserIdToken,
} from "../utility/FirebaseHelpers";
import BottomNavBar from "./BottomNavBar";
import styles from "../styles/Profile";
import { API_BASE_URL } from "@env";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidIcsUrl = (url) => /^https?:\/\/.+\.ics$/.test(url);

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const [showChangeSuccessModal, setShowChangeSuccessModal] = useState(false);
  const [pendingLogoutMessage, setPendingLogoutMessage] = useState("");

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showIcsImportModal, setShowIcsImportModal] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [icsImportLink, setIcsImportLink] = useState("");

  const emailModalNewEmailInputRef = useRef(null);

  const passwordModalNewPasswordInputRef = useRef(null);
  const passwordModalConfirmPasswordInputRef = useRef(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      setUser(await getLoggedInUser());
      setUserData(await getUserDocumentFromFirestore());
    };

    fetchUser();
  }, []);

  const handleIcsImport = async () => {
    const trimmedUrl = icsImportLink.trim();
    if (!trimmedUrl) {
      Alert.alert("Invalid URL", "Please enter a valid iCal link.");
      return;
    }

    if (!isValidIcsUrl(trimmedUrl)) {
      Alert.alert(
        "Invalid URL",
        "This does not appear to be a valid .ics link.",
      );
      return;
    }

    try {
      const idToken = await getCurrentUserIdToken();

      const response = await fetch(`${API_BASE_URL}/api/import-ics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ icsUrl: trimmedUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to import calendar.");
      }

      const result = await response.json();

      Alert.alert(
        "Success",
        `Successfully imported ${result.importedCount} tasks.`,
      );
      setShowIcsImportModal(false);
    } catch (err) {
      console.error("ICS import failed:", err.message);
      Alert.alert("Import Failed", "Could not import your calendar.");
    }
  };

  const handleChangeEmail = async () => {
    if (!currentPassword) {
      Alert.alert("Missing Password", "Please enter your current password.");
      return;
    }

    if (!isValidEmail(newEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (newEmail.trim() === user.email) {
      Alert.alert(
        "No Change",
        "New email cannot be the same as your current email.",
      );
      return;
    }

    try {
      await changeUserEmail(newEmail.trim(), currentPassword.trim());
      setShowEmailModal(false);

      setPendingLogoutMessage(
        "Email updated. You’ll be logged out and need to verify your new email.",
      );
      setShowChangeSuccessModal(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert("Missing Password", "Please enter your current password.");
      return;
    }

    if (!newPassword) {
      Alert.alert("Missing Password", "Please enter your new password.");
      return;
    }

    if (!confirmNewPassword) {
      Alert.alert("Missing Password", "Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert(
        "Password Mismatch",
        "New password does not match confirmed password.",
      );
      return;
    }

    if (newPassword.trim() === currentPassword.trim()) {
      Alert.alert(
        "No Change",
        "New password must be different from your current password.",
      );
      return;
    }

    try {
      await changeUserPassword(newPassword.trim(), currentPassword.trim());
      setShowPasswordModal(false);
      setPendingLogoutMessage(
        "Password Updated. You’ll be logged out and need to login with your new password.",
      );
      setShowChangeSuccessModal(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutLoggedInUser();
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout error:", error);
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
        style={{ flex: 1, backgroundColor: "#0e0d16" }}
      >
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.sectionLabel}>Account Settings</Text>
            <Text style={styles.subtitle}>Manage your account preferences</Text>

            <View style={styles.iconContainer}>
              <Icon name="person-circle" size={80} color="#cf59a9" />

              <View style={styles.userInfo}>
                <View style={styles.userInfoRow}>
                  <Text style={styles.userInfoLabel}>Username:</Text>
                  <Text style={styles.usernameText}>
                    {userData?.username || "Not found"}
                  </Text>
                </View>

                <View style={styles.userInfoRow}>
                  <Text style={styles.userInfoLabel}>Email:</Text>
                  <Text style={styles.emailText}>
                    {userData?.email || "Not found"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setIcsImportLink("");
                setShowIcsImportModal(true);
              }}
            >
              <Text style={styles.buttonText}>Import Calender (.ics)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setCurrentPassword("");
                setNewEmail("");
                setShowEmailModal(true);
              }}
            >
              <Text style={styles.buttonText}>Change Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
                setShowPasswordModal(true);
              }}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>

          <BottomNavBar />
        </View>
      </SafeAreaView>

      {/* Import ics Modal */}
      <Modal
        visible={showIcsImportModal}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBackground}>
            <Text style={styles.modalTitle}>Import Calender (.ics)</Text>

            <TextInput
              placeholder="Enter iCal (.ics) URL"
              placeholderTextColor="#8986a7"
              keyboardAppearance="dark"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              textContentType="URL"
              value={icsImportLink}
              onChangeText={setIcsImportLink}
              style={styles.modalInput}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={() => setShowIcsImportModal(false)}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleIcsImport}>
                <Text style={styles.modalButton}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Email Modal */}
      <Modal
        visible={showEmailModal}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBackground}>
            <Text style={styles.modalTitle}>Change Email</Text>

            <TextInput
              placeholder="Current Password"
              placeholderTextColor="#8986a7"
              keyboardAppearance="dark"
              autoCapitalize="none"
              textContentType="password"
              autoCorrect={false}
              returnKeyType="next"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              style={styles.modalInput}
              onSubmitEditing={() =>
                emailModalNewEmailInputRef.current?.focus()
              }
            />

            <TextInput
              placeholder="New Email"
              placeholderTextColor="#8986a7"
              keyboardAppearance="dark"
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
              autoCorrect={true}
              returnKeyType="done"
              value={newEmail}
              onChangeText={setNewEmail}
              style={styles.modalInput}
              ref={emailModalNewEmailInputRef}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={() => setShowEmailModal(false)}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleChangeEmail}>
                <Text style={styles.modalButton}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBackground}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <TextInput
              placeholder="Current Password"
              placeholderTextColor="#8986a7"
              keyboardAppearance="dark"
              autoCapitalize="none"
              textContentType="password"
              autoCorrect={false}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              style={styles.modalInput}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordModalNewPasswordInputRef.current?.focus()
              }
            />

            <TextInput
              placeholder="New Password"
              placeholderTextColor="#8986a7"
              keyboardAppearance="dark"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.modalInput}
              returnKeyType="next"
              ref={passwordModalNewPasswordInputRef}
              onSubmitEditing={() =>
                passwordModalConfirmPasswordInputRef.current?.focus()
              }
            />

            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor="#8986a7"
              autoCapitalize="none"
              textContentType="password"
              autoCorrect={false}
              keyboardAppearance="dark"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              secureTextEntry
              style={styles.modalInput}
              ref={passwordModalConfirmPasswordInputRef}
              returnKeyType="done"
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.modalButton}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showChangeSuccessModal}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBackground}>
            <Text style={styles.modalTitle}>Success</Text>
            <Text
              style={[
                styles.subtitle,
                { textAlign: "center", marginVertical: 10 },
              ]}
            >
              {pendingLogoutMessage}
            </Text>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { alignSelf: "center", marginTop: 10 },
              ]}
              onPress={async () => {
                setShowChangeSuccessModal(false);
                await signOutLoggedInUser();
                navigation.replace("Login");
              }}
            >
              <Text style={styles.modalButton}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;
