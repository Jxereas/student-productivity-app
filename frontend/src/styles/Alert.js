import { StyleSheet } from "react-native";

const AlertStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    backgroundColor: "#1e1e2d",
    padding: 25,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
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
