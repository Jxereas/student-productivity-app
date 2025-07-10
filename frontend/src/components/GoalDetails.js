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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { getSubtasksByGoalId } from "../utility/FirebaseHelpers";
import styles from "../styles/Tasks";
import TaskCard from "../components/TaskCard";
import BottomNavBar from "./BottomNavBar";

const GoalDetailsScreen = ({ route }) => {
    const [groupedTasks, setGroupedTasks] = useState({});
    const [loadingData, setLoadingData] = useState(true);

    const navigation = useNavigation();
    const { goalId } = route.params;

    useFocusEffect(
        useCallback(() => {
            const fetchTasks = async () => {
                const tasks = await getSubtasksByGoalId(goalId);

                const sortedTasks = [...tasks]
                    .map((task) => ({
                        ...task,
                        dueAt: new Date(task.dueAt.toDate()),
                    }))
                    .sort((a, b) => a.dueAt - b.dueAt);
                const groups = {};

                sortedTasks.forEach((task) => {
                    let label = format(task.dueAt, "MMM dd, yyyy");

                    if (isYesterday(task.dueAt)) label = "Yesterday";
                    else if (isToday(task.dueAt)) label = "Today";
                    else if (isTomorrow(task.dueAt)) label = "Tomorrow";

                    if (!groups[label]) groups[label] = [];
                    groups[label].push(task);
                });

                setGroupedTasks(groups);
                setLoadingData(false);
            };

            setLoadingData(true);
            fetchTasks();
        }, [goalId]),
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

                        <Text style={styles.titleLarge}>Goal Tasks</Text>

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
                            {Object.keys(groupedTasks).length === 0 ? (
                                <Text style={{ color: "#8986a7", marginTop: 20, fontSize: 20 }}>
                                    No tasks for this goal
                                </Text>
                            ) : (
                                Object.keys(groupedTasks).map((date, index) => (
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
                                                        if (updated[date].length === 0)
                                                            delete updated[date];
                                                        return updated;
                                                    });
                                                }}
                                            />
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

export default GoalDetailsScreen;
