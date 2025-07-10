import { StyleSheet } from "react-native";

export default StyleSheet.create({
    cardContainer: {
        marginBottom: 10,
        height: 60,
        width: "100%",
    },
    rightActionContainer: {
        height: 60,
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
        height: 60,
        width: 60,
    },
    leftActionContainer: {
        height: 60,
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
        height: 60,
        width: 60,
    },
    deleteBox: {
        backgroundColor: "#ff4d4d", // red
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        height: 60,
        width: 60,
    },
    taskCard: {
        backgroundColor: "#0e0d16",
        padding: 15,
        borderRadius: 12,
        justifyContent: "center",
        height: 60,
        width: "100%",
        position: "relative",
    },
    taskRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    taskTextContainer: {
        flexShrink: 1,
        flexGrow: 1,
        marginRight: 10,
    },
    taskTitle: {
        color: "#8986a7",
        fontSize: 18,
        fontWeight: "bold",
    },
    dueTimeText: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    priorityPill: {
        backgroundColor: "#cf59a9",
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
        alignItems: "center",
    },
    priorityPillText: {
        color: "#DDDDDD",
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
    },
});
