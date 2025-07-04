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
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { isYesterday, format, startOfDay } from "date-fns";
import { getAllTasksFromFirestore } from "../utility/FirebaseHelpers";
import styles from "../styles/Tasks";
import BottomNavBar from "./BottomNavBar";

const OverdueTasksScreen = () => {
    const navigation = useNavigation();
    const [groupedOverdueTasks, setGroupedOverdueTasks] = useState({});
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchOverdueTasks = async () => {
            try {
                const allTasks = await getAllTasksFromFirestore();

                allTasks.forEach((task) => {
                    task.dueAt = task.dueAt.toDate();
                });

                const today = startOfDay(new Date());

                const overdueTasks = allTasks
                    .filter((task) => startOfDay(task.dueAt) < today)
                    .sort((a, b) => b.dueAt - a.dueAt);

                const groups = {};
                overdueTasks.forEach((task) => {
                    const dueDate = task.dueAt;
                    let label = format(dueDate, "MMM dd, yyyy");

                    if (isYesterday(dueDate)) {
                        label = "Yesterday";
                    }

                    if (!groups[label]) groups[label] = [];
                    groups[label].push(task);
                });

                setGroupedOverdueTasks(groups);
                setLoadingData(false);
            } catch (error) {
                console.error("Error fetching overdue tasks:", error.message);
            }
        };

        fetchOverdueTasks();
    }, []);

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
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="arrow-back" size={26} color="#8986a7" />
                        </TouchableOpacity>

                        <Text style={styles.titleLarge}>Overdue Tasks</Text>

                        {/* Empty view to keep spacing balanced */}
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
                        <ScrollView style={styles.scrollArea}>
                            {Object.keys(groupedOverdueTasks).length === 0 ? (
                                <Text style={{ color: "#8986a7", marginTop: 20, fontSize: 20 }}>
                                    No overdue tasks
                                </Text>
                            ) : (
                                Object.keys(groupedOverdueTasks).map((date, index) => (
                                    <View key={index}>
                                        <Text style={styles.sectionHeading}>{date}</Text>
                                        {groupedOverdueTasks[date].map((task, taskIndex) => (
                                            <View key={taskIndex} style={styles.taskCard}>
                                                <View style={styles.taskRow}>
                                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                                    <View style={styles.priorityPill}>
                                                        <Text style={styles.priorityPillText}>
                                                            {task.priority}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
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

export default OverdueTasksScreen;
