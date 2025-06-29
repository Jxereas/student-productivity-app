import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  gradientContainer: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: "500",
    color: "#d385b3",
    marginBottom: 40,
  },
  titleBold: {
    fontWeight: "900",
  },
  logo: {
    width: 257,
    height: 257,
    marginBottom: 40,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 18,
    color: "#7c7493",
    marginBottom: 2,
  },
  button: {
    backgroundColor: "#812050",
    borderColor: "#d385b3",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "400",
  },
});
