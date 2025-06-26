import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/TasksMainScreen";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import BottomNavBar from "./BottomNavBar";

const TasksMainScreen = () => {
    const navigation = useNavigation();
    const [groupedTasks, setGroupedTasks] = useState({});

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                await signInWithEmailAndPassword(
                    auth,
                    "admin@gmail.com",
                    "administrator",
                ); // This will be removed after testing
                const user = auth.currentUser;
                if (!user) return;

                const q = query(
                    collection(db, "tasks"),
                    where("userId", "==", user.uid),
                );

                const snapshot = await getDocs(q);

                const tasks = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Group tasks by date
                const groups = {};
                tasks.forEach((task) => {
                    const dueDate = parseISO(task.dueDate);
                    let label = format(dueDate, "MMM dd, yyyy");

                    if (isToday(dueDate)) label = "Today";
                    else if (isTomorrow(dueDate)) label = "Tomorrow";

                    if (!groups[label]) groups[label] = [];
                    groups[label].push(task);
                });

                setGroupedTasks(groups);
            } catch (error) {
                console.error("Error fetching tasks:", error.code, error.message);
            }
        };

        fetchTasks();
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
                    <Text style={styles.titleLarge}>Tasks</Text>

                    <ScrollView style={styles.scrollArea}>
                        {Object.keys(groupedTasks).map((date, index) => (
                            <View key={index}>
                                <Text style={styles.sectionHeading}>{date}</Text>
                                {groupedTasks[date].map((task, taskIndex) => (
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
                        ))}
                    </ScrollView>

                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => navigation.navigate("SearchTasksScreen")}
                        >
                            <Text style={styles.buttonText}>Search Tasks</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate("AddTaskScreen")}
                        >
                            <Text style={styles.buttonText}>Add Task</Text>
                        </TouchableOpacity>
                    </View>

                    <BottomNavBar />
                </View>
            </SafeAreaView>
        </>
    );
};

export default TasksMainScreen;
