import "react-native-reanimated";
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AlertProvider } from "./src/components/Alert";
import Home from "./src/components/Home";
import SignUp from "./src/components/SignUp";
import Login from "./src/components/Login";
import ForgotPassword from "./src/components/ForgotPassword";
import Dashboard from "./src/components/Dashboard";
import Tasks from "./src/components/Tasks";
import OverdueTasks from "./src/components/OverdueTasks";
import AddTask from "./src/components/AddTask";
import EditTask from "./src/components/EditTask";
import SearchTasks from "./src/components/SearchTasks";
import SearchTasksResults from "./src/components/SearchTasksResults";
import Goals from "./src/components/Goals";
import OverdueGoals from "./src/components/OverdueGoals";
import GoalDetails from "./src/components/GoalDetails";
import AddGoal from "./src/components/AddGoal";
import SearchGoals from "./src/components/SearchGoals";
import SearchGoalsResults from "./src/components/SearchGoalsResults";
import Profile from "./src/components/Profile";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AlertProvider>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Home"
                        screenOptions={{ headerShown: false }}
                    >
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="SignUp" component={SignUp} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                        <Stack.Screen name="Dashboard" component={Dashboard} />
                        <Stack.Screen name="Tasks" component={Tasks} />
                        <Stack.Screen name="OverdueTasks" component={OverdueTasks} />
                        <Stack.Screen name="AddTask" component={AddTask} />
                        <Stack.Screen name="EditTask" component={EditTask} />
                        <Stack.Screen name="SearchTasks" component={SearchTasks} />
                        <Stack.Screen
                            name="SearchTasksResults"
                            component={SearchTasksResults}
                        />
                        <Stack.Screen name="Goals" component={Goals} />
                        <Stack.Screen name="OverdueGoals" component={OverdueGoals} />
                        <Stack.Screen name="GoalDetails" component={GoalDetails} />
                        <Stack.Screen name="AddGoal" component={AddGoal} />
                        <Stack.Screen name="SearchGoals" component={SearchGoals} />
                        <Stack.Screen
                            name="SearchGoalsResults"
                            component={SearchGoalsResults}
                        />
                        <Stack.Screen name="Profile" component={Profile} />
                    </Stack.Navigator>
                </NavigationContainer>
            </AlertProvider>
        </GestureHandlerRootView>
    );
}
