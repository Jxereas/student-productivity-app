import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import styles from "../styles/BottomNavBar";

const BottomNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name;

  const tabs = [
    { name: "Dashboard", icon: "home" },
    { name: "Goals", icon: "bullseye" },
    { name: "Tasks", icon: "check-square" },
    { name: "Profile", icon: "user" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => {
            if (currentRoute !== tab.name) navigation.navigate(tab.name);
          }}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={currentRoute === tab.name ? "#cf59a9" : "#7c7493"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavBar;
