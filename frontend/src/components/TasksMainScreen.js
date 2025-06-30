import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
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
import { collection, query, where, getDocs } from "firebase/firestore";
import { format, isToday, isTomorrow, parseISO, startOfDay } from "date-fns";
import BottomNavBar from "./BottomNavBar";
import { signInWithEmailAndPassword } from "firebase/auth";

const TasksMainScreen = () => {
    const navigation = useNavigation();
    const [groupedTasks, setGroupedTasks] = useState({});
    const [overdueCount, setOverdueCount] = useState(0);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (__DEV__) {
                    await signInWithEmailAndPassword(
                        auth,
                        "admin@gmail.com",
                        "administrator",
                    );
                }

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

                tasks.sort((a, b) => parseISO(a.dueDate) - parseISO(b.dueDate));

                const today = startOfDay(new Date());
                let overdue = 0;

                // Group tasks by date
                const groups = {};
                tasks.forEach((task) => {
                    const dueDate = startOfDay(parseISO(task.dueDate));
    
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

                setOverdueCount(overdue);
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
                            onPress={() => navigation.navigate("OverdueTasksScreen")}
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
