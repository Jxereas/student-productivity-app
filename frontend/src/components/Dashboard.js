import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  getAllTasksFromFirestore,
  getAllGoalsFromFirestore,
} from "../utility/FirebaseHelpers";
import { isSameDay, parseISO, startOfDay } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/Dashboard";
import GoalCard from "../components/GoalCard";
import TaskCard from "../components/TaskCard";
import BottomNavBar from "../components/BottomNavBar";

const LandingPage = () => {
  const [loadingData, setLoadingData] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);

  const [todaysGoals, setTodaysGoals] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([]);

  const [goalCardCount, setGoalCardCount] = useState(0);
  const [taskCardCount, setTaskCardCount] = useState(0);

  const [usedTopHeight, setUsedTopHeight] = useState(0);
  const [usedBottomHeight, setUsedBottomHeight] = useState(0);

  const [goalScrollHeight, setGoalScrollHeight] = useState(0);
  const [taskScrollHeight, setTaskScrollHeight] = useState(0);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchUserData = async () => {
      const [fetchedGoals, fetchedTasks] = await Promise.all([
        getAllGoalsFromFirestore(),
        getAllTasksFromFirestore(),
      ]);

      fetchedTasks.forEach((task) => {
        task.dueAt = task.dueAt.toDate();
      });

      fetchedGoals.forEach((goal) => {
        goal.dueAt = goal.dueAt.toDate();
      });

      const today = new Date(); // May be wrapped in isStartOfDay() later on, not done for performance currently since ran through isSameDay

      const todaysGoals = fetchedGoals.filter((goal) =>
        isSameDay(goal.dueAt, today),
      );

      const todaysTasks = fetchedTasks.filter((task) =>
        isSameDay(task.dueAt, today),
      );

      setGoals(fetchedGoals);
      setTasks(fetchedTasks);
      setTodaysGoals(todaysGoals);
      setTodaysTasks(todaysTasks);
      setLoadingData(false);
    };

    fetchUserData();

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
      40; //100; // extra margin + spacing

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

  const getGoalProgress = (goalId) => {
    const relatedTasks = tasks.filter((task) => task.goalId === goalId);
    const completedCount = relatedTasks.filter((task) => task.completed).length;
    const totalCount = relatedTasks.length;

    const progressPercent =
      totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
    return { completedCount, totalCount, progressPercent };
  };

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

            {!loadingData && <Text style={styles.heading}>Goals</Text>}
          </View>
          {loadingData ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#cf59a9" />
            </View>
          ) : (
            <>
              <ScrollView
                style={[
                  styles.goalScrollContainer,
                  { height: goalScrollHeight },
                ]}
                contentContainerStyle={styles.goalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {todaysGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    tasks={tasks}
                    onDelete={() => {
                      setGoals((prev) => prev.filter((g) => g.id !== goal.id));
                      setTodaysGoals((prev) =>
                        prev.filter((g) => g.id !== goal.id),
                      );
                    }}
                  />
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
                style={[
                  styles.taskScrollContainer,
                  { height: taskScrollHeight },
                ]}
                contentContainerStyle={styles.taskScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {todaysTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={() => {
                      setTodaysTasks((prev) =>
                        prev.filter((t) => t.id !== task.id),
                      );
                      setTasks((prev) => prev.filter((t) => t.id !== task.id));
                    }}
                  />
                ))}
              </ScrollView>
            </>
          )}
          <BottomNavBar />
        </View>
      </SafeAreaView>
    </>
  );
};

export default LandingPage;
