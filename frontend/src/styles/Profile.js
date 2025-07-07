import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#04060c",
        paddingBottom: 80,
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 36,
        color: "#d385b3",
        fontWeight: "bold",
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
    },
    userInfo: {
        alignItems: "center",
        marginTop: 12,
        alignItems: "center",
    },
    userInfoRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 6,
        gap: 8,
    },

    userInfoLabel: {
        color: "#9e9cac",
        fontSize: 18,
        fontWeight: "500",
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#8986a7",
        textAlign: "center",
        marginBottom: 4,
    },
    subtitle: {
        color: "#aaa",
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center",
    },
    contentCard: {
        backgroundColor: "#0e0d16",
        paddingHorizontal: 10,
        paddingVertical: 30,
        borderRadius: 12,
    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 15,
    },
    emailText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },
    usernameText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#333",
        marginVertical: 20,
        width: "80%",
        alignSelf: "center",
        opacity: 0.3,
    },
    button: {
        backgroundColor: "#262437",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    logoutButton: {
        backgroundColor: "#cf59a9",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.8)",
    },
    modalBackground: {
        backgroundColor: "#1e1e2d",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        width: "85%",
    },
    modalTitle: {
        fontSize: 18,
        color: "#fff",
        marginBottom: 15,
        textAlign: "center",
    },
    modalInput: {
        backgroundColor: "#262437",
        color: "#ffffff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 13,
        width: "100%",
    },
    modalButtonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "60%",
        gap: 60,
    },
    modalButton: {
        color: "#cf59a9",
        fontWeight: "bold",
    },
});
