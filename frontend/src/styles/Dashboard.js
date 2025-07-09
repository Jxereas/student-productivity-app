import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04060c",
    padding: 20,
    paddingBottom: 70, // Padding for nav bar
  },
  titleContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  titleSmall: {
    fontSize: 20,
    color: "#7c7493",
    fontWeight: "400",
  },
  titleLarge: {
    fontSize: 36,
    color: "#d385b3",
    fontWeight: "bold",
  },
  heading: {
    fontSize: 24,
    color: "#d385b3",
    marginBottom: 10,
    fontWeight: "bold",
  },
  emptyGoalStateContainer: {
    width: "100%",
    height: 50, // this is dynamically set fallback height
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyGoalStateBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0e0d16",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#2c2b3e", // soft accent
  },
  emptyTaskStateContainer: {
    width: "100%",
    height: 50, // this is dynamically set fallback height
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTaskStateBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0e0d16",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#2c2b3e", // soft accent
  },
  checkmarkCircle: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#8986a7",
  },

  goalScrollContainer: {
    marginBottom: 20,
    flexGrow: 0,
  },
  goalScrollContent: {
    flexGrow: 1,
    overflow: "hidden",
  },
  goalCard: {
    backgroundColor: "#0e0d16",
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    height: 75,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  goalTitle: {
    color: "#8986a7",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
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
  taskScrollContainer: {
    marginBottom: 20,
    flexGrow: 0,
  },
  taskScrollContent: {
    flexGrow: 1,
    overflow: "hidden",
  },
  taskCard: {
    backgroundColor: "#0e0d16",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    height: 60,
    justifyContent: "center",
  },
  taskTitle: {
    color: "#8986a7",
    fontSize: 20,
    fontWeight: "bold",
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskPriorityPill: {
    backgroundColor: "#cf59a9",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  taskPriorityPillText: {
    color: "#DDDDDD",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
