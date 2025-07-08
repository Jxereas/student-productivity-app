import { StyleSheet } from "react-native";

const AlertStyles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",

        zIndex: 9999, // Add this
        position: "absolute", // Forces it to overlay entire screen
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    alertBox: {
        backgroundColor: "#1e1e2d",
        padding: 25,
        borderRadius: 12,
        width: "85%",
        alignItems: "center",

        zIndex: 10000,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 12,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: "#aaa",
        textAlign: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: "#cf59a9",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AlertStyles;
