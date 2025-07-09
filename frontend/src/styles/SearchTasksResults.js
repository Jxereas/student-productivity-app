import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04060c",
    padding: 20,
    paddingBottom: 70, // make space for BottomNavBar
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    color: "#d385b3",
    fontWeight: "bold",
  },
  emptyTaskStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
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
});
