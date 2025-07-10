import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#04060c",
        padding: 24,
    },
    titleContainer: {
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 90,
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 60,
        color: "#8a7494",
        fontWeight: "bold",
    },
    input: {
        backgroundColor: "#0e0d16",
        color: "#8986a7",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#812050",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "400",
    },
    subtitle: {
        marginTop: 15,
        alignSelf: "center",
        fontSize: 18,
        color: "#7c7493",
    },
    link: {
        color: "#cf59a9",
        fontWeight: "bold",
        alignSelf: "center",
        fontSize: 18,
        marginTop: 5,
    },
});
