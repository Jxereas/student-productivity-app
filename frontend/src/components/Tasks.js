import React, { useState, useEffect, useCallback } from "react";
import Icon from "react-native-vector-icons/Ionicons";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { format, isToday, isTomorrow, startOfDay } from "date-fns";
import { getAllTasksFromFirestore } from "../utility/FirebaseHelpers";
import styles from "../styles/Tasks";
import TaskCard from "./TaskCard";
import BottomNavBar from "./BottomNavBar";

const TasksMainScreen = () => {
    const navigation = useNavigation();
    const [groupedTasks, setGroupedTasks] = useState({});
    const [overdueCount, setOverdueCount] = useState(0);
    const [loadingData, setLoadingData] = useState(true);

    const [emptyTaskContainerWidth, setEmptyTaskContainerWidth] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const fetchTasks = async () => {
                try {
                    const tasks = await getAllTasksFromFirestore();

                    tasks.forEach((task) => {
                        task.dueAt = task.dueAt.toDate();
                    });

                    tasks.sort((a, b) => a.dueAt - b.dueAt);

                    const today = startOfDay(new Date());
                    let overdue = 0;

                    // Group tasks by date
                    const groups = {};
                    tasks.forEach((task) => {
                        const dueDate = startOfDay(task.dueAt);

                        if (dueDate < today) {
                            overdue++;
                            return;
                        }

                        let label = format(dueDate, "MMM dd, yyyy");

                        if (isToday(dueDate)) label = "Today";
                        else if (isTomorrow(dueDate)) label = "Tomorrow";

                        if (!groups[label]) groups[label] = [];
                        groups[label].push(task);
                    });

                    Object.keys(groups).forEach((label) => {
                        groups[label].sort((a, b) => a.dueAt - b.dueAt);
                    });

                    setOverdueCount(overdue);
                    setGroupedTasks(groups);
                    setLoadingData(false);
                } catch (error) {
                    console.error("Error fetching tasks:", error.code, error.message);
                }
            };

            setLoadingData(true);
            fetchTasks();
        }, []),
    );

    const handleRemoveTask = (taskId) => {
        setGroupedTasks((prevGroups) => {
            const newGroups = {};

            for (const [label, tasks] of Object.entries(prevGroups)) {
                const updatedTasks = tasks.filter((task) => task.id !== taskId);
                if (updatedTasks.length > 0) {
                    newGroups[label] = updatedTasks;
                }
                // If the group is now empty, skip adding it back (optional)
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
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >
                        <Text style={styles.titleLarge}>Tasks</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("OverdueTasks")}
                        >
                            <View style={{ padding: 6 }}>
                                <Icon name="notifications-outline" size={26} color="#fff" />
                                {overdueCount > 0 && (
                                    <View
                                        style={{
                                            position: "absolute",
                                            right: 6,
                                            top: 0,
                                            backgroundColor: "#ff6bcb",
                                            borderRadius: 8,
                                            minWidth: 16,
                                            height: 16,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            paddingHorizontal: 3,
                                        }}
                                    >
                                        <Text style={{ color: "white", fontSize: 10 }}>
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
                            {Object.keys(groupedTasks).length === 0 ? (
                                <View
                                    style={styles.emptyTaskStateContainer}
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
                                                    height: 150,
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
                                                No upcoming tasks found.
                                            </Text>
                                        </View>
                                    </Shadow>
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
                                                    onDelete={() => handleRemoveTask(task.id)}
                                                />
                                            ))}
                                        </View>
                                    ))}
                                </ScrollView>
                            )}

                            <View style={styles.actionButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.secondaryButton}
                                    onPress={() => navigation.navigate("SearchTasks")}
                                >
                                    <Text style={styles.buttonText}>Search Tasks</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={() => navigation.navigate("AddTask")}
                                >
                                    <Text style={styles.buttonText}>Add Task</Text>
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

export default TasksMainScreen;
