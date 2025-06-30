import React, { useState, useRef, useCallback } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#1e1e2d",
              padding: 25,
              borderRadius: 12,
              width: "85%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {messageData.title}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#ccc",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {messageData.message}
            </Text>

            <TouchableOpacity onPress={close}>
              <Text
                style={{
                  color: "#cf59a9",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
