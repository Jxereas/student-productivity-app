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
import styles from "../styles/SearchTasksResults";
import TaskCard from "../components/TaskCard";
import BottomNavBar from "./BottomNavBar";
import { getAllTasksFromFirestore } from "../utility/FirebaseHelpers";

const SearchTasksResults = () => {
  const [groupedTasks, setGroupedTasks] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const navigation = useNavigation();
  const route = useRoute();
  const { filters } = route.params;

  useEffect(() => {
    const fetchFilteredTasks = async () => {
      try {
        const allTasks = await getAllTasksFromFirestore();

        allTasks.forEach((task) => {
          task.dueAt = task.dueAt.toDate();
          task.createdAt = task.createdAt.toDate();
        });

        const dateFields = [
          "createdAfter",
          "createdBefore",
          "dueAfter",
          "dueBefore",
        ];

        dateFields.forEach((key) => {
          if (filters[key] && typeof filters[key] === "string") {
            filters[key] = new Date(filters[key]);
          }
        });

        const now = new Date();
        const todayStart = startOfDay(now);
        const nextWeek = new Date(todayStart);
        nextWeek.setDate(todayStart.getDate() + 7);

        const filteredTasks = allTasks.filter((task) => {
          const { title, createdAt, dueAt } = task;

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

          if (filters.hasGoal && !task.goalId) {
            return false;
          }

          if (filters.standAloneTask && task.goalId) {
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
        filteredTasks.sort((a, b) => a.dueAt - b.dueAt);
        const grouped = {};
        filteredTasks.forEach((task) => {
          const dueDate = startOfDay(task.dueAt);
          let label = format(dueDate, "MMM dd, yyyy");
          if (isYesterday(dueDate)) label = "Yesterday";
          else if (isToday(dueDate)) label = "Today";
          else if (isTomorrow(dueDate)) label = "Tomorrow";

          if (!grouped[label]) grouped[label] = [];
          grouped[label].push(task);
        });

        setTasks(allTasks);
        setGroupedTasks(grouped);
        setLoadingData(false);
      } catch (error) {
        console.error("Error fetching filtered goals:", error.message);
        setLoadingData(false);
      }
    };

    fetchFilteredTasks();
  }, [filters]);

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
              {Object.keys(groupedTasks).map((date, index) => (
                <View key={index}>
                  <Text style={styles.sectionHeading}>{date}</Text>
                  {groupedTasks[date].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={() => {
                        setGroupedTasks((prev) => {
                          const updated = { ...prev };
                          updated[date] = updated[date].filter(
                            (t) => t.id !== task.id,
                          );
                          if (updated[date].length === 0) delete updated[date];
                          return updated;
                        });

                        setTasks((prev) =>
                          prev.filter((t) => t.id !== task.id),
                        );
                      }}
                    />
                  ))}
                </View>
              ))}
            </ScrollView>
          )}
          <BottomNavBar />
        </View>
      </SafeAreaView>
    </>
  );
};

export default SearchTasksResults;
