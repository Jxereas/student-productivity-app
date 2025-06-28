import { StyleSheet } from "react-native";

export default StyleSheet.create({
    leftActionContainer: {
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: 60,
        width: "100%",
    },
    completeBox: {
        width: 60,
        height: "100%",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    rightActionContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        height: 60,
    },
    editBox: {
        width: 70,
        height: "100%",
        backgroundColor: "#444",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    },
    deleteBox: {
        width: 70,
        height: "100%",
        backgroundColor: "#ff4d4d",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    },
});
