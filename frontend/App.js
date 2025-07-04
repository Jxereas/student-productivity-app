import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AlertProvider } from "./src/components/Alert";
import Home from "./src/components/Home";
import SignUp from "./src/components/SignUp";
import Login from "./src/components/Login";
import Tasks from "./src/components/Tasks";
import OverdueTasks from "./src/components/OverdueTasks";
import ForgotPassword from "./src/components/ForgotPassword";
import AddTask from "./src/components/AddTask";
import Goals from "./src/components/Goals";
import OverdueGoals from "./src/components/OverdueGoals";
import Dashboard from "./src/components/Dashboard";
import GoalDetails from "./src/components/GoalDetails";
import AddGoal from "./src/components/AddGoal";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
          <Stack.Screen name="Goals" component={Goals} />
          <Stack.Screen name="OverdueGoals" component={OverdueGoals} />
          <Stack.Screen name="GoalDetails" component={GoalDetails} />
          <Stack.Screen name="AddGoal" component={AddGoal} />
        </Stack.Navigator>
      </NavigationContainer>
    </AlertProvider>
  );
}
