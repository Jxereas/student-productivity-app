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
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { format, isToday, isTomorrow, parseISO, startOfDay } from "date-fns";
import {
    getAllTasksFromFirestore,
    getAllGoalsFromFirestore,
} from "../utility/FirebaseHelpers";
import styles from "../styles/Goals";
import BottomNavBar from "./BottomNavBar";

const GoalsMainScreen = () => {
    const [groupedGoals, setGroupedGoals] = useState({});
    const [tasks, setTasks] = useState([]);
    const [overdueCount, setOverdueCount] = useState(0);
    const [loadingData, setLoadingData] = useState(true);

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
                            <ScrollView
                                style={styles.scrollArea}
                                showsVerticalScrollIndicator={false}
                            >
                                {Object.keys(groupedGoals).map((date, index) => (
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
                                                            index === groupedGoals[date].length - 1 && {
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
                                ))}
                            </ScrollView>

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
