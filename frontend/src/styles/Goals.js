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
  overdueCounterCircle: {
    position: "absolute",
    right: 6,
    top: 0,
    backgroundColor: "#ff6bcb",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  overdueCounterText: {
    color: "white",
    fontSize: 10,
  },
  emptyGoalStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 15,
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
