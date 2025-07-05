import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { format, isToday, isTomorrow, isYesterday, startOfDay } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/Goals";
import BottomNavBar from "./BottomNavBar";
import {
  getAllGoalsFromFirestore,
  getAllTasksFromFirestore,
} from "../utility/FirebaseHelpers";

const SearchGoalsResults = () => {
  const [groupedGoals, setGroupedGoals] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const navigation = useNavigation();
  const route = useRoute();
  const { filters } = route.params;

  useEffect(() => {
    const fetchFilteredGoals = async () => {
      try {
        const [allGoals, allTasks] = await Promise.all([
          getAllGoalsFromFirestore(),
          getAllTasksFromFirestore(),
        ]);

        // Convert timestamps
        allGoals.forEach((goal) => {
          goal.dueAt = goal.dueAt.toDate();
          goal.createdAt = goal.createdAt.toDate();
        });

        allTasks.forEach((task) => (task.dueAt = task.dueAt.toDate()));

        const dateFields = [
          "createdAfter",
          "createdBefore",
          "dueAfter",
          "dueBefore",
        ];

        dateFields.forEach((key) => {
          if (filters[key] && typeof filters[key] === "string") {
            filters[key] = new Date(filters[key]);
            console.log(filters[key]);
          }
        });

        const now = new Date();
        const todayStart = startOfDay(now);
        const nextWeek = new Date(todayStart);
        nextWeek.setDate(todayStart.getDate() + 7);

        const filteredGoals = allGoals.filter((goal) => {
          const { title, createdAt, dueAt } = goal;

          if (
            filters.title &&
            !title.toLowerCase().includes(filters.title.toLowerCase())
          ) {
            return false;
          }

          if (filters.createdAfter && createdAt < filters.createdAfter) {
            return false;
          }

          if (filters.createdBefore && createdAt > filters.createdBefore) {
            return false;
          }

          if (filters.dueAfter && dueAt < filters.dueAfter) {
            return false;
          }

          if (filters.dueBefore && dueAt > filters.dueBefore) {
            return false;
          }

          if (filters.dueToday && !isToday(dueAt)) {
            return false;
          }

          if (
            filters.dueThisWeek &&
            !(dueAt >= todayStart && dueAt <= nextWeek)
          ) {
            return false;
          }

          if (filters.overdue && dueAt >= now) {
            return false;
          }

          return true;
        });

        // Sort and group goals
        filteredGoals.sort((a, b) => a.dueAt - b.dueAt);
        const grouped = {};
        filteredGoals.forEach((goal) => {
          const dueDate = startOfDay(goal.dueAt);
          let label = format(dueDate, "MMM dd, yyyy");
          if (isYesterday(dueDate)) label = "Yesterday";
          else if (isToday(dueDate)) label = "Today";
          else if (isTomorrow(dueDate)) label = "Tomorrow";

          if (!grouped[label]) grouped[label] = [];
          grouped[label].push(goal);
        });

        setTasks(allTasks);
        setGroupedGoals(grouped);
        setLoadingData(false);
      } catch (error) {
        console.error("Error fetching filtered goals:", error.message);
        setLoadingData(false);
      }
    };

    fetchFilteredGoals();
  }, [filters]);

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
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={26} color="#8986a7" />
            </TouchableOpacity>
            <Text style={styles.title}>Search Results</Text>
            <View style={{ width: 26 }} />
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
            <ScrollView
              style={styles.scrollArea}
              showsVerticalScrollIndicator={false}
            >
              {Object.keys(groupedGoals).length === 0 ? (
                <Text style={styles.noResultsText}>No results found.</Text>
              ) : (
                Object.keys(groupedGoals).map((date, index) => (
                  <View key={index}>
                    <Text style={styles.sectionHeading}>{date}</Text>
                    {groupedGoals[date].map((goal, goalIndex) => {
                      const { completedCount, totalCount, progressPercent } =
                        getGoalProgress(goal.id);

                      return (
                        <TouchableOpacity
                          key={goalIndex}
                          onPress={() =>
                            navigation.navigate("GoalDetailsScreen", { goal })
                          }
                        >
                          <View
                            style={[
                              styles.goalCard,
                              goalIndex === groupedGoals[date].length - 1 && {
                                marginBottom: 0,
                              },
                            ]}
                          >
                            <Text style={styles.goalTitle}>{goal.title}</Text>
                            <View style={styles.progressBarContainer}>
                              <View style={styles.progressBarBackground}>
                                <LinearGradient
                                  colors={["#cf59a9", "#d385b3"]}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  style={[
                                    styles.progressBarFill,
                                    { width: `${progressPercent}%` },
                                  ]}
                                />
                              </View>
                              <Text style={styles.progressText}>
                                {completedCount}/{totalCount}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))
              )}
            </ScrollView>
          )}
          <BottomNavBar />
        </View>
      </SafeAreaView>
    </>
  );
};

export default SearchGoalsResults;
