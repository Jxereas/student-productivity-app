import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/components/HomeScreen";
import SignUp from "./src/components/SignUp";
import Login from "./src/components/Login";
import ForgotPassword from "./src/components/ForgotPassword";
import Dashboard from "./src/components/Dashboard";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Dashboard"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="TasksMainScreen" component={TasksMainScreen} />
                <Stack.Screen
                    name="OverdueTasksScreen"
                    component={OverdueTasksScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
