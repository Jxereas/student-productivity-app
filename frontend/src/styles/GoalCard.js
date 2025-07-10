import { StyleSheet } from "react-native";

export default StyleSheet.create({
    cardContainer: {
        marginBottom: 10,
        height: 75,
        width: "100%",
    },
    rightActionContainer: {
        height: 75,
        width: "100%",
        backgroundColor: "#ff6bcb",
        borderRadius: 12,
        justifyContent: "center",
        position: "absolute",
        left: 0,
        top: 0,
    },
    checkmarkBox: {
        justifyContent: "center",
        alignItems: "center",
        height: 75,
        width: 60,
    },
    leftActionContainer: {
        height: 75,
        width: "100%",
        backgroundColor: "#121212",
        borderRadius: 12,
        position: "absolute",
        right: 0,
        top: 0,
        flexDirection: "row-reverse",
    },
    editBox: {
        backgroundColor: "#4a4a4a", // dark gray
        justifyContent: "center",
        alignItems: "center",
        height: 75,
        width: 60,
    },
    deleteBox: {
        backgroundColor: "#ff4d4d", // red
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        height: 75,
        width: 60,
    },
    goalCard: {
        backgroundColor: "#0e0d16",
        borderRadius: 12,
        padding: 8,
        height: 75,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    goalRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    goalTitleWrapper: {
        flexShrink: 1,
        marginRight: 10, // spacing between title and time
    },
    goalTitle: {
        color: "#8986a7",
        fontSize: 20,
        fontWeight: "bold",
    },
    dueTimeText: {
        color: "#666",
        fontSize: 14,
        flexShrink: 0,
    },
    progressBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    progressBarBackground: {
        flex: 1,
        height: 10,
        backgroundColor: "#292840",
        borderRadius: 5,
        marginRight: 10,
    },
    progressBarFill: {
        height: 10,
        backgroundColor: "#cf59a9",
        borderRadius: 5,
    },
    progressText: {
        color: "#d385b3",
        fontSize: 14,
        textAlign: "right",
    },
});
