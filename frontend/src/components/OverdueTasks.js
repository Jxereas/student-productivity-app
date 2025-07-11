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
import { Shadow } from "react-native-shadow-2";
import Icon from "react-native-vector-icons/Ionicons";
import { isYesterday, format, startOfDay, isToday } from "date-fns";
import { getAllTasksFromFirestore } from "../utility/FirebaseHelpers";
import styles from "../styles/Tasks";
import TaskCard from "../components/TaskCard";
import BottomNavBar from "./BottomNavBar";

const OverdueTasksScreen = () => {
    const navigation = useNavigation();
    const [groupedOverdueTasks, setGroupedOverdueTasks] = useState({});
    const [loadingData, setLoadingData] = useState(true);

    const [emptyTaskContainerWidth, setEmptyTaskContainerWidth] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const fetchOverdueTasks = async () => {
                try {
                    const allTasks = await getAllTasksFromFirestore();

                    allTasks.forEach((task) => {
                        task.dueAt = task.dueAt.toDate();
                    });

                    const now = new Date();

                    const overdueTasks = allTasks
                        .filter((task) => task.dueAt < now && !task.completed)
                        .sort((a, b) => b.dueAt - a.dueAt);

                    const groups = {};
                    overdueTasks.forEach((task) => {
                        const dueDate = task.dueAt;
                        let label = format(dueDate, "MMM dd, yyyy");

                        if (isToday(dueDate)) label = "Today";
                        else if (isYesterday(dueDate)) label = "Yesterday";

                        if (!groups[label]) groups[label] = [];
                        groups[label].push(task);
                    });

                    Object.keys(groups).forEach((label) => {
                        groups[label].sort((a, b) => a.dueAt - b.dueAt);
                    });

                    setGroupedOverdueTasks(groups);
                    setLoadingData(false);
                } catch (error) {
                    console.error("Error fetching overdue tasks:", error.message);
                }
            };

            setLoadingData(true);
            fetchOverdueTasks();
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
                        <>
                            {Object.keys(groupedOverdueTasks).length === 0 ? (
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
                                                No overdue task found.
                                            </Text>
                                        </View>
                                    </Shadow>
                                </View>
                            ) : (
                                <ScrollView style={styles.scrollArea}>
                                    {Object.keys(groupedOverdueTasks).map((date, index) => (
                                        <View key={index}>
                                            <Text style={styles.sectionHeading}>{date}</Text>
                                            {groupedOverdueTasks[date].map((task) => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    onDelete={() => {
                                                        setGroupedOverdueTasks((prev) => {
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

export default OverdueTasksScreen;
