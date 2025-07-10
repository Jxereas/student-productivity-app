import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    FlatList,
} from "react-native";
import Alert from "./Alert";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import {
    updateGoalInFirestore,
    updateTaskInFirestore,
    addGoalToFirestore,
    addTaskToFirestore,
    deleteTask,
    addMultipleTasksToFirestore,
} from "../utility/FirebaseHelpers";
import { format } from "date-fns";
import BottomNavBar from "./BottomNavBar";
import styles from "../styles/EditGoal";

const EditGoalScreen = ({ route }) => {
    const navigation = useNavigation();
    const [goalTitle, setGoalTitle] = useState("");
    const [goalDueDate, setGoalDueDate] = useState(new Date());
    const [goalTempDueDate, setGoalTempDueDate] = useState(new Date());
    const [goalDueTime, setGoalDueTime] = useState(new Date());
    const [goalTempDueTime, setGoalTempDueTime] = useState(new Date());
    const [goalDateSelected, setGoalDateSelected] = useState(false);
    const [goalTimeSelected, setGoalTimeSelected] = useState(false);
    const [showGoalDatePicker, setShowGoalDatePicker] = useState(false);
    const [showGoalTimePicker, setShowGoalTimePicker] = useState(false);
    const [editingSubTaskId, setEditingSubTaskId] = useState(null);
    const [showSubTaskDatePicker, setShowSubTaskDatePicker] = useState(false);
    const [showSubTaskTimePicker, setShowSubTaskTimePicker] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [subTasks, setSubTasks] = useState([]);

    const { goal, subTasks: incomingSubTasks } = route.params;

    useEffect(() => {
        // Set goal information
        setGoalTitle(goal.title || "");
        const goalDueDateObj = new Date(goal.dueAt);
        setGoalDueDate(goalDueDateObj);
        setGoalTempDueDate(goalDueDateObj);
        setGoalDateSelected(true);

        setGoalDueTime(goalDueDateObj);
        setGoalTempDueTime(goalDueDateObj);
        setGoalTimeSelected(true);

        // Convert and initialize subtask list
        const parsedSubTasks = incomingSubTasks.map((task, index) => {
            const due = new Date(task.dueAt);
            return {
                id: index,
                title: task.title,
                dueDate: due,
                tempDueDate: due,
                dueTime: due,
                tempDueTime: due,
                dateSelected: true,
                timeSelected: true,
                priority: task.priority || null,
                expanded: true,
                originalId: task.id, // store Firestore doc ID for later updates
            };
        });

        setSubTasks(parsedSubTasks);
    }, []);

    const addSubTask = () => {
        setSubTasks((prev) => [
            ...prev,
            {
                id: prev.length,
                title: "",
                dueDate: new Date(),
                tempDueDate: new Date(),
                dueTime: new Date(),
                tempDueTime: new Date(),
                dateSelected: false,
                timeSelected: false,
                priority: null,
                expanded: true,
            },
        ]);
    };

    const updateSubTask = (id, field, value) => {
        setSubTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, [field]: value } : task)),
        );
    };

    const deleteSubTask = (id) => {
        setSubTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const toggleSubTask = (id) => {
        setSubTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, expanded: !task.expanded } : task,
            ),
        );
    };

    const handleEditGoal = async () => {
        if (!goalTitle.trim()) {
            Alert.alert("Invalid Title", "Please enter a goal title.");
            return;
        }

        if (!goalDateSelected || !goalTimeSelected) {
            Alert.alert("Invalid Due Date", "Please select a goal due date.");
            return;
        }

        if (!goalTimeSelected) {
            Alert.alert("Invalid Time", "Please select a goal due time.");
            return;
        }

        const combinedGoalDateTime = new Date(
            goalDueDate.getFullYear(),
            goalDueDate.getMonth(),
            goalDueDate.getDate(),
            goalDueTime.getHours(),
            goalDueTime.getMinutes(),
        );

        const updatedSubTasks = [];
        const newSubTasks = [];

        for (let i = 0; i < subTasks.length; i++) {
            const task = subTasks[i];
            const taskLabel = `Task ${i + 1}`;

            const isEmpty =
                !task.title.trim() &&
                !task.dateSelected &&
                !task.timeSelected &&
                !task.priority;

            if (isEmpty) continue;

            if (!task.title.trim()) {
                Alert.alert("Invalid Title", `Please enter a title for ${taskLabel}.`);
                return;
            }

            if (!task.dateSelected) {
                Alert.alert(
                    "Invalid Due Date",
                    `Please select a due date for ${taskLabel}.`,
                );
                return;
            }

            if (!task.timeSelected) {
                Alert.alert(
                    "Invalid Due Time",
                    `Please select a due time for ${taskLabel}.`,
                );
                return;
            }

            if (!task.priority) {
                Alert.alert(
                    "Invalid Priority",
                    `Please select a priority for ${taskLabel}.`,
                );
                return;
            }

            const combinedDateTime = new Date(
                task.dueDate.getFullYear(),
                task.dueDate.getMonth(),
                task.dueDate.getDate(),
                task.dueTime.getHours(),
                task.dueTime.getMinutes(),
            );

            const taskData = {
                title: task.title.trim(),
                priority: task.priority,
                dueDateTime: combinedDateTime,
                goalId: goal.id,
            };

            if (task.originalId) {
                updatedSubTasks.push({ ...taskData, id: task.originalId });
            } else {
                newSubTasks.push(taskData);
            }
        }

        try {
            // Update goal
            await updateGoalInFirestore(goal.id, {
                title: goalTitle.trim(),
                dueAt: combinedGoalDateTime,
            });

            // Update existing tasks
            for (const t of updatedSubTasks) {
                await updateTaskInFirestore(t.id, {
                    title: t.title,
                    priority: t.priority,
                    dueAt: t.dueDateTime,
                });
            }

            // Add new tasks
            for (const t of newSubTasks) {
                await addTaskToFirestore(t.title, t.priority, t.dueDateTime, goal.id);
            }

            // Detect and delete removed subtasks
            const originalIds = route.params.subTasks.map((t) => t.id);
            const retainedIds = updatedSubTasks.map((t) => t.id);
            const deletedIds = originalIds.filter((id) => !retainedIds.includes(id));

            for (const id of deletedIds) {
                await deleteTask({ id });
            }

            setShowSuccessNotification(true);
        } catch (error) {
            Alert.alert("Failure", "Failed to edit goal.");
        }
    };

    const renderSubTask = ({ item, index }) => (
        <View style={styles.fieldContainer}>
            <View style={styles.dividerContainer}>
                <View style={styles.dividerLineLeft} />
                <Text style={styles.taskLabel}>Task {index + 1}</Text>
                <View style={styles.dividerLineRight} />
                <TouchableOpacity
                    style={styles.expandButton}
                    onPress={() => toggleSubTask(item.id)}
                >
                    <View style={styles.circle}>
                        <MaterialIcons
                            name={item.expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                            size={20}
                            color="#8986a7"
                        />
                    </View>
                </TouchableOpacity>
            </View>

            {item.expanded && (
                <>
                    {/* Subtask Fields */}
                    <TextInput
                        style={styles.input}
                        placeholder="Subtask Title"
                        placeholderTextColor="#8986a7"
                        value={item.title}
                        onChangeText={(text) => updateSubTask(item.id, "title", text)}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            setEditingSubTaskId(item.id);
                            setShowSubTaskDatePicker(true);
                        }}
                        style={styles.dateInput}
                    >
                        <Text
                            style={[
                                styles.dateText,
                                { color: item.dateSelected ? "#ffffff" : "#8986a7" },
                            ]}
                        >
                            {item.dateSelected
                                ? format(item.dueDate, "MMMM dd, yyyy")
                                : "Select due date"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setEditingSubTaskId(item.id);
                            setShowSubTaskTimePicker(true);
                        }}
                        style={styles.dateInput}
                    >
                        <Text
                            style={[
                                styles.dateText,
                                { color: item.timeSelected ? "#ffffff" : "#8986a7" },
                            ]}
                        >
                            {item.timeSelected
                                ? format(item.dueTime, "h:mm a")
                                : "Select due time"}
                        </Text>
                    </TouchableOpacity>

                    {/* Priority Dropdown */}
                    <DropDownPicker
                        open={item.dropdownOpen || false}
                        value={item.priority}
                        items={[
                            { label: "Low", value: "Low" },
                            { label: "Medium", value: "Medium" },
                            { label: "High", value: "High" },
                        ]}
                        setOpen={(open) => updateSubTask(item.id, "dropdownOpen", open)}
                        setValue={(callback) =>
                            updateSubTask(item.id, "priority", callback(item.priority))
                        }
                        setItems={() => { }}
                        placeholder="Select Priority"
                        placeholderStyle={{ color: "#8986a7" }}
                        textStyle={{ color: "#ffffff" }}
                        style={{
                            backgroundColor: "#1e1e2d",
                            borderWidth: 0,
                            marginBottom: 15,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: "#1e1e2d",
                            borderWidth: 0,
                        }}
                        arrowIconStyle={{
                            tintColor: item.priority ? "#ffffff" : "#8986a7",
                        }}
                        TickIconComponent={() => (
                            <MaterialIcons
                                name="check"
                                size={20}
                                color={item.priority ? "#ffffff" : "#8986a7"}
                            />
                        )}
                        listItemLabelStyle={{ color: "#ffffff" }}
                        labelStyle={{ color: "#ffffff" }}
                    />

                    <TouchableOpacity
                        style={styles.inlineRemoveTaskRow}
                        onPress={() => deleteSubTask(item.id)}
                    >
                        <MaterialIcons name="remove" size={20} color="#ff4d6d" />
                        <Text style={styles.inlineRemoveTaskText}>Remove Task</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
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
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={{ flex: 1 }}
                    >
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="arrow-back" size={26} color="#8986a7" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Edit Goal</Text>
                            <View style={{ width: 26 }} />
                        </View>

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={subTasks}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderSubTask}
                            ListHeaderComponent={
                                <View>
                                    <View style={styles.dividerContainer}>
                                        <View style={styles.dividerLineLeft} />
                                        <Text style={styles.taskLabel}>Goal</Text>
                                        <View style={styles.dividerLineRight} />
                                    </View>

                                    <TextInput
                                        style={styles.input}
                                        placeholder="Goal Title"
                                        placeholderTextColor="#8986a7"
                                        value={goalTitle}
                                        onChangeText={setGoalTitle}
                                    />

                                    <TouchableOpacity
                                        onPress={() => setShowGoalDatePicker(true)}
                                        style={styles.dateInput}
                                    >
                                        <Text
                                            style={[
                                                styles.dateText,
                                                { color: goalDateSelected ? "#ffffff" : "#8986a7" },
                                            ]}
                                        >
                                            {goalDateSelected
                                                ? format(goalDueDate, "MMMM dd, yyyy")
                                                : "Select a due date"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setShowGoalTimePicker(true)}
                                        style={styles.dateInput}
                                    >
                                        <Text
                                            style={[
                                                styles.dateText,
                                                { color: goalTimeSelected ? "#ffffff" : "#8986a7" },
                                            ]}
                                        >
                                            {goalTimeSelected
                                                ? format(goalDueTime, "h:mm a")
                                                : "Select a due time"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            ListFooterComponent={
                                <TouchableOpacity
                                    onPress={addSubTask}
                                    style={styles.inlineAddTaskRow}
                                >
                                    <MaterialIcons name="add" size={20} color="#cf59a9" />
                                    <Text style={styles.inlineAddTaskText}>Add Task</Text>
                                </TouchableOpacity>
                            }
                        />

                        <TouchableOpacity
                            style={[styles.button, { marginTop: 10 }]}
                            onPress={handleEditGoal}
                        >
                            <Text style={styles.buttonText}>Edit Goal</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>

                    <BottomNavBar />
                </View>
            </SafeAreaView>

            {/* Goal Date & Time Pickers */}
            {showGoalDatePicker && Platform.OS !== "ios" && (
                <DateTimePicker
                    value={goalDueDate}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                        setShowGoalDatePicker(false);
                        if (selectedDate && event.type === "set") {
                            setGoalDueDate(selectedDate);
                            setGoalDateSelected(true);
                        }
                    }}
                />
            )}

            {showGoalTimePicker && Platform.OS !== "ios" && (
                <DateTimePicker
                    value={goalDueTime}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedTime) => {
                        setShowGoalTimePicker(false);
                        if (selectedTime && event.type === "set") {
                            setGoalDueTime(selectedTime);
                            setGoalTimeSelected(true);
                        }
                    }}
                />
            )}

            {showGoalDatePicker && Platform.OS === "ios" && (
                <View style={styles.iosModalOverlay}>
                    <View style={styles.iosModalBackground}>
                        <DateTimePicker
                            value={goalDueDate}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => {
                                if (selectedDate && event.type == "set") {
                                    setGoalTempDueDate(selectedDate);
                                }
                            }}
                            themeVariant="dark"
                        />

                        <View style={styles.iosModalButtonRow}>
                            <TouchableOpacity
                                onPress={() => setShowGoalDatePicker(false)}
                                style={{ padding: 5, alignItems: "center" }}
                            >
                                <Text style={[styles.iosModalButton, { marginRight: 60 }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setGoalDueDate(goalTempDueDate);
                                    setGoalDateSelected(true);
                                    setShowGoalDatePicker(false);
                                }}
                                style={{ padding: 5, alignItems: "center" }}
                            >
                                <Text style={styles.iosModalButton}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {showGoalTimePicker && Platform.OS === "ios" && (
                <View style={styles.iosModalOverlay}>
                    <View style={styles.iosModalBackground}>
                        <DateTimePicker
                            value={goalDueTime}
                            mode="time"
                            display="spinner"
                            onChange={(event, selectedTime) => {
                                if (selectedTime && event.type == "set") {
                                    setGoalTempDueTime(selectedTime);
                                }
                            }}
                            themeVariant="dark"
                        />

                        <View style={styles.iosModalButtonRow}>
                            <TouchableOpacity
                                onPress={() => setShowGoalTimePicker(false)}
                                style={{ padding: 5, alignItems: "center" }}
                            >
                                <Text style={[styles.iosModalButton, { marginRight: 60 }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setGoalDueTime(goalTempDueTime);
                                    setGoalTimeSelected(true);
                                    setShowGoalTimePicker(false);
                                }}
                                style={{ padding: 5, alignItems: "center" }}
                            >
                                <Text style={styles.iosModalButton}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {showSubTaskDatePicker &&
                Platform.OS !== "ios" &&
                (() => {
                    const task = subTasks.find((t) => t.id === editingSubTaskId);

                    return (
                        <DateTimePicker
                            value={task.dueDate}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => {
                                setShowSubTaskDatePicker(false);
                                if (selectedDate && event.type == "set") {
                                    updateSubTask(task.id, "dueDate", selectedDate);
                                    updateSubTask(task.id, "dateSelected", true);
                                }
                            }}
                        />
                    );
                })()}

            {showSubTaskTimePicker &&
                Platform.OS !== "ios" &&
                (() => {
                    const task = subTasks.find((t) => t.id === editingSubTaskId);

                    return (
                        <DateTimePicker
                            value={task.dueTime}
                            mode="time"
                            display="spinner"
                            onChange={(event, selectedTime) => {
                                setShowSubTaskTimePicker(false);
                                if (selectedTime && event.type == "set") {
                                    updateSubTask(task.id, "dueTime", selectedTime);
                                    updateSubTask(task.id, "timeSelected", true);
                                }
                            }}
                        />
                    );
                })()}

            {showSubTaskDatePicker &&
                Platform.OS === "ios" &&
                (() => {
                    const task = subTasks.find((t) => t.id === editingSubTaskId);

                    return (
                        <View style={styles.iosModalOverlay}>
                            <View style={styles.iosModalBackground}>
                                <DateTimePicker
                                    value={task.dueDate}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate && event.type == "set") {
                                            updateSubTask(task.id, "tempDueDate", selectedDate);
                                        }
                                    }}
                                    themeVariant="dark"
                                />

                                <View style={styles.iosModalButtonRow}>
                                    <TouchableOpacity
                                        onPress={() => setShowSubTaskDatePicker(false)}
                                        style={{ padding: 5, alignItems: "center" }}
                                    >
                                        <Text style={[styles.iosModalButton, { marginRight: 60 }]}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            updateSubTask(task.id, "dueDate", task.tempDueDate);
                                            updateSubTask(task.id, "dateSelected", true);
                                            setShowSubTaskDatePicker(false);
                                        }}
                                        style={{ padding: 5, alignItems: "center" }}
                                    >
                                        <Text style={styles.iosModalButton}>Select</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                })()}

            {showSubTaskTimePicker &&
                Platform.OS === "ios" &&
                (() => {
                    const task = subTasks.find((t) => t.id === editingSubTaskId);

                    return (
                        <View style={styles.iosModalOverlay}>
                            <View style={styles.iosModalBackground}>
                                <DateTimePicker
                                    value={task.dueTime}
                                    mode="time"
                                    display="spinner"
                                    onChange={(event, selectedTime) => {
                                        if (selectedTime && event.type == "set") {
                                            updateSubTask(task.id, "tempDueTime", selectedTime);
                                        }
                                    }}
                                    themeVariant="dark"
                                />

                                <View style={styles.iosModalButtonRow}>
                                    <TouchableOpacity
                                        onPress={() => setShowSubTaskTimePicker(false)}
                                        style={{ padding: 5, alignItems: "center" }}
                                    >
                                        <Text style={[styles.iosModalButton, { marginRight: 60 }]}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            updateSubTask(task.id, "dueTime", task.tempDueTime);
                                            updateSubTask(task.id, "timeSelected", true);
                                            setShowSubTaskTimePicker(false);
                                        }}
                                        style={{ padding: 5, alignItems: "center" }}
                                    >
                                        <Text style={styles.iosModalButton}>Select</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                })()}

            {showSuccessNotification && (
                <View style={styles.notificationContainer}>
                    <View style={styles.notificationBackground}>
                        <Text style={styles.notificationTitle}>
                            Goal successfully edited!
                        </Text>

                        <FontAwesomeIcon
                            name="check-circle"
                            size={40}
                            color="#cf59a9"
                            style={{ marginBottom: 20 }}
                        />

                        <Text style={styles.notificationMessage}>
                            {goalTitle
                                ? `“${goalTitle}” has been edited within your goals.`
                                : "Your goal edits are now saved."}
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                setShowSuccessNotification(false);
                                navigation.goBack();
                            }}
                        >
                            <Text style={styles.notificationButton}>Continue to Goals</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </>
    );
};

export default EditGoalScreen;
