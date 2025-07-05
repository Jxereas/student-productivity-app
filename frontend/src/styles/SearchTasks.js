import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04060c",
    padding: 20,
    paddingBottom: 80,
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
    scrollContainer: {
        flex: 1,
    },
  input: {
    color: "#ffffff",
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputWithClear: {
    borderRadius: 10,
    backgroundColor: "#1e1e2d",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  dateInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: "center",
  },
  dateText: {
    color: "#8986a7",
    fontSize: 16,
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  checkboxContainer: {
    backgroundColor: "#1e1e2d",
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: "center",
        alignContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  checkboxLabel: {
    color: "#8986a7",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#cf59a9",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  iosModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 999,
  },
  iosModalBackground: {
    backgroundColor: "#1e1e2d",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "85%",
  },
  iosModalButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
  },
  iosModalButton: {
    color: "#cf59a9",
    fontWeight: "bold",
  },
});

export default styles;
