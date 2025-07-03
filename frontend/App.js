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
import Goals from "./src/components/Goals";
import OverdueGoals from "./src/components/GoalsOverdue";
import Dashboard from "./src/components/Dashboard";
import GoalDetailsScreen from "./src/components/GoalDetailsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <AlertProvider>
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
                    <Stack.Screen name="AddTask" component={AddTask} />
                    <Stack.Screen name="Goals" component={Goals} />
                    <Stack.Screen name="OverdueGoals" component={OverdueGoals} />
        <Stack.Screen name="GoalDetailsScreen" component={GoalDetailsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </AlertProvider>
    );
}
