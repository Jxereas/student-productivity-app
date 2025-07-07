import React, { useEffect, useState } from "react";
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
} from "../utility/FirebaseHelpers";
import BottomNavBar from "./BottomNavBar";
import styles from "../styles/Profile";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ProfileScreen = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    const [showChangeSuccessModal, setShowChangeSuccessModal] = useState(false);
    const [pendingLogoutMessage, setPendingLogoutMessage] = useState("");

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    const navigation = useNavigation();

    useEffect(() => {
        const fetchUser = async () => {
            setUser(await getLoggedInUser());
            setUserData(await getUserDocumentFromFirestore());
        };

        fetchUser();
    }, []);

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
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                            style={styles.modalInput}
                        />

                        <TextInput
                            placeholder="New Email"
                            placeholderTextColor="#8986a7"
                            value={newEmail}
                            onChangeText={setNewEmail}
                            style={styles.modalInput}
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
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                            style={styles.modalInput}
                        />

                        <TextInput
                            placeholder="New Password"
                            placeholderTextColor="#8986a7"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            style={styles.modalInput}
                        />

                        <TextInput
                            placeholder="Confirm New Password"
                            placeholderTextColor="#8986a7"
                            value={confirmNewPassword}
                            onChangeText={setConfirmNewPassword}
                            secureTextEntry
                            style={styles.modalInput}
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
