import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shadow } from "react-native-shadow-2";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { format, isToday, isTomorrow, parseISO, startOfDay } from "date-fns";
import {
  getAllTasksFromFirestore,
  getAllGoalsFromFirestore,
} from "../utility/FirebaseHelpers";
import styles from "../styles/Goals";
import GoalCard from "./GoalCard";
import BottomNavBar from "./BottomNavBar";

const GoalsMainScreen = () => {
  const [groupedGoals, setGroupedGoals] = useState({});
  const [tasks, setTasks] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  const [emptyGoalContainerWidth, setEmptyGoalContainerWidth] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [goals, userTasks] = await Promise.all([
          getAllGoalsFromFirestore(),
          getAllTasksFromFirestore(),
        ]);

        userTasks.forEach((task) => {
          task.dueAt = task.dueAt.toDate();
        });

        goals.forEach((goal) => {
          goal.dueAt = goal.dueAt.toDate();
        });

        goals.sort((a, b) => a.dueAt - b.dueAt);

        const today = startOfDay(new Date());
        let overdue = 0;

        // Group tasks by date
        const groups = {};
        goals.forEach((goal) => {
          const dueDate = startOfDay(goal.dueAt);

          if (dueDate < today) {
            overdue++;
            return;
          }

          let label = format(dueDate, "MMM dd, yyyy");

          if (isToday(dueDate)) label = "Today";
          else if (isTomorrow(dueDate)) label = "Tomorrow";

          if (!groups[label]) groups[label] = [];
          groups[label].push(goal);
        });

        setOverdueCount(overdue);
        setGroupedGoals(groups);
        setTasks(userTasks);
        setLoadingData(false);
      } catch (error) {
        console.error("Error fetching tasks:", error.code, error.message);
      }
    };

    fetchTasks();
  }, []);

  const handleRemoveGoal = (goalId) => {
    setGroupedGoals((prevGroups) => {
      const newGroups = {};

      for (const [label, goals] of Object.entries(prevGroups)) {
        const updatedGoals = goals.filter((goal) => goal.id !== goalId);
        if (updatedGoals.length > 0) {
          newGroups[label] = updatedGoals;
        }
      }

      return newGroups;
    });
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
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Goals</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("OverdueGoals")}
            >
              <View style={{ padding: 6 }}>
                <Icon name="notifications-outline" size={26} color="#fff" />
                {!loadingData && overdueCount > 0 && (
                  <View style={styles.overdueCounterCircle}>
                    <Text style={styles.overdueCounterText}>
                      {overdueCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
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
              {Object.keys(groupedGoals).length === 0 ? (
                <View
                  style={styles.emptyGoalStateContainer}
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
                          height: 150,
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
                        No upcoming goals found.
                      </Text>
                    </View>
                  </Shadow>
                </View>
              ) : (
                <ScrollView
                  style={styles.scrollArea}
                  showsVerticalScrollIndicator={false}
                >
                  {Object.keys(groupedGoals).map((date, index) => (
                    <View key={index}>
                      <Text style={styles.sectionHeading}>{date}</Text>
                      {groupedGoals[date].map((goal) => (
                        <GoalCard
                          key={goal.id}
                          goal={goal}
                          tasks={tasks}
                          onDelete={() => handleRemoveGoal(goal.id)}
                        />
                      ))}
                    </View>
                  ))}
                </ScrollView>
              )}

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate("SearchGoals")}
                >
                  <Text style={styles.buttonText}>Search Goals</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate("AddGoal")}
                >
                  <Text style={styles.buttonText}>Add Goal</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <BottomNavBar />
        </View>
      </SafeAreaView>
    </>
  );
};

export default GoalsMainScreen;
