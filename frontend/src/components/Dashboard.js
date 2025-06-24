import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StatusBar, Dimensions } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/Dashboard";
import BottomNavBar from "../components/BottomNavBar";

const LandingPage = () => {
  const [goalCardCount, setGoalCardCount] = useState(0);
  const [taskCardCount, setTaskCardCount] = useState(0);

  const [usedTopHeight, setUsedTopHeight] = useState(0);
  const [usedBottomHeight, setUsedBottomHeight] = useState(0);

  const [goalScrollHeight, setGoalScrollHeight] = useState(0);
  const [taskScrollHeight, setTaskScrollHeight] = useState(0);

  // Mock data for now
  const goals = [
    { title: "Clean the House", tasks: [] },
    { title: "Study for Exam", tasks: [] },
    { title: "Grocery Shopping", tasks: [] },
    { title: "Clean the House", tasks: [] },
    { title: "Study for Exam", tasks: [] },
    { title: "Grocery Shopping", tasks: [] },
  ];
  const tasks = [
    { title: "Vacuum Living Room", priority: "High" },
    { title: "Read Chapter 5", priority: "Medium" },
    { title: "Do Laundry", priority: "Low" },
    { title: "Vacuum Living Room", priority: "High" },
    { title: "Read Chapter 5", priority: "Medium" },
    { title: "Do Laundry", priority: "Low" },
  ];

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (usedTopHeight === 0 || usedBottomHeight === 0) return;
    const screenHeight = Dimensions.get("window").height;

    const padding = 20 * 2; // top + bottom padding
    const navBarHeight = 90;
    const staticUsedHeight =
      padding +
      navBarHeight +
      usedTopHeight +
      usedBottomHeight +
      insets.top +
      insets.bottom +
      40//100; // extra margin + spacing

    const availableHeight = screenHeight - staticUsedHeight;

    const goalCardHeight = 75 + 10; // height + marginBottom
    const taskCardHeight = 60 + 10;

    const totalCardHeight = goalCardHeight + taskCardHeight;
    let totalCardsFit = Math.floor(availableHeight / totalCardHeight) * 2;

    // If there's leftover space enough for a goalCard, add one more goal card
    if (availableHeight % totalCardHeight >= goalCardHeight) {
      totalCardsFit += 1;
    }

    // Prefer extra card to goals
    const maxGoalCards = Math.ceil(totalCardsFit / 2);
    const maxTaskCards = Math.floor(totalCardsFit / 2);

    setGoalCardCount(maxGoalCards);
    setTaskCardCount(maxTaskCards);

    setGoalScrollHeight(maxGoalCards * 75 + 10 * (maxGoalCards - 1));
    setTaskScrollHeight(maxTaskCards * 60 + 10 * (maxTaskCards - 1));
  }, [usedBottomHeight, usedTopHeight, insets]);

  return (
    <>
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 0, backgroundColor: "#04060c" }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#04060c" />
      </SafeAreaView>

      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{ flex: 1, backgroundColor: "#0e0d16" }}
      >
        <View style={styles.container}>
          <View
            onLayout={(e) => {
              setUsedTopHeight(e.nativeEvent.layout.height);
            }}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.titleSmall}>Today's</Text>
              <Text style={styles.titleLarge}>Overview</Text>
            </View>

            <Text style={styles.heading}>Goals</Text>
          </View>
          <ScrollView
            style={[styles.goalScrollContainer, { height: goalScrollHeight }]}
            contentContainerStyle={styles.goalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {goals.map((goal, index) => (
              <View
                key={index}
                style={[
                  styles.goalCard,
                  index === goals.length - 1 && { marginBottom: 0 },
                ]}
              >
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <LinearGradient
                      colors={["#cf59a9", "#d385b3"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressBarFill, { width: "80%" }]}
                    />
                  </View>
                  <Text style={styles.progressText}>8/10</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View
            onLayout={(e) => {
              setUsedBottomHeight(e.nativeEvent.layout.height);
            }}
          >
            <Text style={styles.heading}>Tasks</Text>
          </View>
          <ScrollView
            style={[styles.taskScrollContainer, { height: taskScrollHeight }]}
            contentContainerStyle={styles.taskScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {tasks.map((task, index) => (
              <View
                key={index}
                style={[
                  styles.taskCard,
                  index === tasks.length - 1 && { marginBottom: 0 },
                ]}
              >
                <View style={styles.taskRow}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={styles.taskPriorityPill}>
                    <Text style={styles.taskPriorityPillText}>
                      {task.priority}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <BottomNavBar />
        </View>
      </SafeAreaView>
    </>
  );
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "High":
      return { backgroundColor: "#ff4d4d" };
    case "Medium":
      return { backgroundColor: "#ffa500" };
    case "Low":
      return { backgroundColor: "#4caf50" };
    default:
      return { backgroundColor: "#ccc" };
  }
};

export default LandingPage;
