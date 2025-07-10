import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  getAllTasksFromFirestore,
  getAllGoalsFromFirestore,
} from "../utility/FirebaseHelpers";
import { isSameDay } from "date-fns";
import { Shadow } from "react-native-shadow-2";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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

  const [emptyGoalContainerWidth, setEmptyGoalContainerWidth] = useState(0);
  const [emptyTaskContainerWidth, setEmptyTaskContainerWidth] = useState(0);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (usedTopHeight === 0 || usedBottomHeight === 0) return;

    const screenHeight = Dimensions.get("window").height;

    const padding = 20 * 2; // top + bottom padding
    const navBarHeight = 70;
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

  useFocusEffect(
    useCallback(() => {
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

      setLoadingData(true);
      fetchUserData();
    }, []),
  );

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
              {todaysGoals.length === 0 ? (
                <View
                  style={[
                    styles.emptyGoalStateContainer,
                    { height: goalScrollHeight },
                  ]}
                  onLayout={(e) =>
                    setEmptyGoalContainerWidth(e.nativeEvent.layout.width)
                  }
                >
                  <Shadow
                    distance={10}
                    offset={[0, 3]}
                    startColor="rgba(207, 89, 169, 0.1)"
                  >
                    <View
                      style={[
                        styles.emptyGoalStateBackground,
                        {
                          height: goalScrollHeight - 80,
                          width: emptyGoalContainerWidth - 40,
                        },
                      ]}
                    >
                      <View style={styles.checkmarkCircle}>
                        <Icon
                          name="checkmark-circle-outline"
                          size={70}
                          color="#d385b3"
                        />
                      </View>
                      <Text style={styles.emptyStateText}>
                        No goals due today.
                      </Text>
                    </View>
                  </Shadow>
                </View>
              ) : (
                <ScrollView
                  style={[
                    styles.goalScrollContainer,
                    { height: goalScrollHeight },
                  ]}
                  contentContainerStyle={styles.goalScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {todaysGoals.map((goal, index) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      tasks={tasks}
                      isLast={index === todaysGoals.length - 1}
                      onDelete={() => {
                        setGoals((prev) =>
                          prev.filter((g) => g.id !== goal.id),
                        );
                        setTodaysGoals((prev) =>
                          prev.filter((g) => g.id !== goal.id),
                        );
                      }}
                    />
                  ))}
                </ScrollView>
              )}
              <View
                onLayout={(e) => {
                  setUsedBottomHeight(e.nativeEvent.layout.height);
                }}
              >
                <Text style={styles.heading}>Tasks</Text>
              </View>
              {todaysTasks.length === 0 ? (
                <View
                  style={[
                    styles.emptyTaskStateContainer,
                    { height: taskScrollHeight },
                  ]}
                  onLayout={(e) =>
                    setEmptyTaskContainerWidth(e.nativeEvent.layout.width)
                  }
                >
                  <Shadow
                    distance={10}
                    offset={[0, 3]}
                    startColor="rgba(207, 89, 169, 0.1)"
                  >
                    <View
                      style={[
                        styles.emptyTaskStateBackground,
                        {
                          height: taskScrollHeight,
                          width: emptyTaskContainerWidth - 40,
                        },
                      ]}
                    >
                      <View style={styles.checkmarkCircle}>
                        <Icon
                          name="checkmark-done-outline"
                          size={70}
                          color="#d385b3"
                        />
                      </View>
                      <Text style={styles.emptyStateText}>
                        No tasks due today.
                      </Text>
                    </View>
                  </Shadow>
                </View>
              ) : (
                <ScrollView
                  style={[
                    styles.taskScrollContainer,
                    { height: taskScrollHeight },
                  ]}
                  contentContainerStyle={styles.taskScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {todaysTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isLast={index === todaysTasks.length - 1}
                      onDelete={() => {
                        setTodaysTasks((prev) =>
                          prev.filter((t) => t.id !== task.id),
                        );
                        setTasks((prev) =>
                          prev.filter((t) => t.id !== task.id),
                        );
                      }}
                    />
                  ))}
                </ScrollView>
              )}
            </>
          )}
          <BottomNavBar />
        </View>
      </SafeAreaView>
    </>
  );
};

export default LandingPage;
