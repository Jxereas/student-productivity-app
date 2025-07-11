import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shadow } from "react-native-shadow-2";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { format, startOfDay, isYesterday, isToday } from "date-fns";
import {
    getAllTasksFromFirestore,
    getAllGoalsFromFirestore,
} from "../utility/FirebaseHelpers";
import styles from "../styles/Goals";
import GoalCard from "../components/GoalCard";
import BottomNavBar from "./BottomNavBar";

const OverdueGoalsScreen = () => {
    const [groupedOverdueGoals, setGroupedOverdueGoals] = useState({});
    const [tasks, setTasks] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [emptyGoalContainerWidth, setEmptyGoalContainerWidth] = useState(0);

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const fetchOverdueGoals = async () => {
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

                    const now = new Date();

                    const overdueGoals = goals
                        .filter((goal) => goal.dueAt < now && !goal.completed)
                        .sort((a, b) => b.dueAt - a.dueAt);

                    const groups = {};
                    overdueGoals.forEach((goal) => {
                        const dueDate = goal.dueAt;
                        let label = format(dueDate, "MMM dd, yyyy");

                        if (isToday(dueDate)) label = "Today";
                        else if (isYesterday(dueDate)) label = "Yesterday";

                        if (!groups[label]) groups[label] = [];
                        groups[label].push(goal);
                    });

                    Object.keys(groups).forEach((label) => {
                        groups[label].sort((a, b) => a.dueAt - b.dueAt);
                    });

                    setTasks(userTasks);
                    setGroupedOverdueGoals(groups);
                    setLoadingData(false);
                } catch (error) {
                    console.error("Error fetching overdue goals:", error.message);
                }
            };

            setLoadingData(true);
            fetchOverdueGoals();
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
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
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
                        <>
                            {Object.keys(groupedOverdueGoals).length === 0 ? (
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
                                                No overdue goals found.
                                            </Text>
                                        </View>
                                    </Shadow>
                                </View>
                            ) : (
                                <ScrollView
                                    style={styles.scrollArea}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {Object.keys(groupedOverdueGoals).map((date, index) => (
                                        <View key={index}>
                                            <Text style={styles.sectionHeading}>{date}</Text>
                                            {groupedOverdueGoals[date].map((goal) => (
                                                <GoalCard
                                                    key={goal.id}
                                                    goal={goal}
                                                    tasks={tasks}
                                                    onDelete={() => {
                                                        setGroupedOverdueGoals((prev) => {
                                                            const updated = { ...prev };
                                                            updated[date] = updated[date].filter(
                                                                (g) => g.id !== goal.id,
                                                            );
                                                            if (updated[date].length === 0) {
                                                                delete updated[date];
                                                            }
                                                            return updated;
                                                        });
                                                    }}
                                                />
                                            ))}
                                        </View>
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

export default OverdueGoalsScreen;
