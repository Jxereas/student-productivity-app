import React, { useState, useRef, useCallback } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import styles from "../styles/Alert";

let alertInstance = null;

export const AlertProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [messageData, setMessageData] = useState({ title: "", message: "" });

    const open = useCallback((title, message) => {
        setMessageData({ title, message });
        setVisible(true);
    }, []);

    const close = () => {
        setVisible(false);
    };

    alertInstance = open;

    return (
        <>
            {children}
            {visible && (
                <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                    <View style={styles.modalBackground}>
                        <View style={styles.alertBox}>
                            <Text style={styles.title}>{messageData.title}</Text>
                            <Text style={styles.message}>{messageData.message}</Text>
                            <TouchableOpacity onPress={close}>
                                <Text style={styles.buttonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </>
    );
};

const Alert = {
    alert: (title, message) => {
        if (alertInstance) {
            alertInstance(title, message);
        } else {
            console.warn("Alert system not initialized.");
        }
    },
};

export default Alert;
