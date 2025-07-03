import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { parseISO, format, startOfDay, isYesterday } from "date-fns";
import {
    getAllTasksFromFirestore,
    getAllGoalsFromFirestore,
} from "../utility/FirebaseHelpers";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/Goals";
import BottomNavBar from "./BottomNavBar";

const OverdueGoalsScreen = () => {
    const [groupedOverdueGoals, setGroupedOverdueGoals] = useState({});
    const [tasks, setTasks] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchOverdueGoals = async () => {
            try {
                const goals = await getAllGoalsFromFirestore();

                const now = new Date();
                const overdueGoals = goals
                    .filter(
                        (goal) => startOfDay(parseISO(goal.dueDate)) < startOfDay(now),
                    )
                    .sort((a, b) => parseISO(b.dueDate) - parseISO(a.dueDate));

                const groups = {};
                overdueGoals.forEach((goal) => {
                    const dueDate = parseISO(goal.dueDate);
                    let label = format(dueDate, "MMM dd, yyyy");
                    if (isYesterday(dueDate)) label = "Yesterday";

                    if (!groups[label]) groups[label] = [];
                    groups[label].push(goal);
                });

                const userTasks = await getAllTasksFromFirestore();

                setTasks(userTasks);
                setGroupedOverdueGoals(groups);
                setLoadingData(false);
            } catch (error) {
                console.error("Error fetching overdue goals:", error.message);
            }
        };

        fetchOverdueGoals();
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
                        <TouchableOpacity onPress={() => navigation.navigate("Goals")}>
                            <Icon name="arrow-back" size={26} color="#8986a7" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Overdue Goals</Text>
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
                            {Object.keys(groupedOverdueGoals).map((date, index) => (
                                <View key={index}>
                                    <Text style={styles.sectionHeading}>{date}</Text>
                                    {groupedOverdueGoals[date].map((goal, goalIndex) => {
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
                                                        index === groupedOverdueGoals[date].length - 1 && {
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
                    )}

                    <BottomNavBar />
                </View>
            </SafeAreaView>
        </>
    );
};

export default OverdueGoalsScreen;
