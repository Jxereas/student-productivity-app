import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#04060c",
        padding: 20,
        paddingBottom: 70, // make space for BottomNavBar
    },
    titleLarge: {
        fontSize: 36,
        color: "#d385b3",
        fontWeight: "bold",
    },
    scrollArea: {
        flex: 1,
        marginBottom: 15,
    },
    sectionHeading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#d385b3",
        marginTop: 10,
        marginBottom: 10,
    },
    taskCard: {
        backgroundColor: "#0e0d16",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    taskRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    taskTitle: {
        color: "#8986a7",
        fontSize: 18,
        fontWeight: "bold",
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
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 10,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: "#cf59a9",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: "#262437",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
