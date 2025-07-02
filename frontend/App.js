import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AlertProvider } from "./src/components/Alert";
import HomeScreen from "./src/components/HomeScreen";
import SignUp from "./src/components/SignUp";
import Login from "./src/components/Login";
import TasksMainScreen from "./src/components/TasksMainScreen";
import OverdueTasksScreen from "./src/components/TasksOverdueScreen";
import ForgotPassword from "./src/components/ForgotPassword";
import AddTask from "./src/components/AddTask";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AlertProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="AddTask"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="TasksMainScreen" component={TasksMainScreen} />
          <Stack.Screen
            name="OverdueTasksScreen"
            component={OverdueTasksScreen}
          />
          <Stack.Screen name="AddTask" component={AddTask} />
        </Stack.Navigator>
      </NavigationContainer>
    </AlertProvider>
  );
}
