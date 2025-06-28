import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./src/components/HomeScreen";
import SignUp from "./src/components/SignUp";
import TasksMainScreen from "./src/components/TasksMainScreen";
import OverdueTasksScreen from "./src/components/TasksOverdueScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TasksMainScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="TasksMainScreen" component={TasksMainScreen} />
          <Stack.Screen
            name="OverdueTasksScreen"
            component={OverdueTasksScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
