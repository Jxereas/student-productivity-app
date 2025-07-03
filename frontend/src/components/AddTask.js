import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Alert from "./Alert";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { format } from "date-fns";
import { addTaskToFirestore } from "../utility/FirebaseHelpers";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/AddTask";
import BottomNavBar from "./BottomNavBar";

const AddTaskScreen = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTemptDate, setDueTempDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);
  const [dueTime, setDueTime] = useState(new Date());
  const [dueTempTime, setDueTempTime] = useState(new Date());
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [priority, setPriority] = useState(null);
  const [priorityItems, setPriorityItems] = useState([
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ]);

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert("Invalid Title", "Please enter a task title.");
      return;
    }

    if (!dateSelected) {
      Alert.alert("Invalid Due Date", "Please select a due date.");
      return;
    }

    if (!timeSelected) {
      Alert.alert("Invalid Due Time", "Please select a due time.");
      return;
    }

    if (!priority) {
      Alert.alert("Invalid Priority", "Please select a priority.");
      return;
    }

    try {
      const combinedDateTime = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate(),
        dueTime.getHours(),
        dueTime.getMinutes(),
      );

      await addTaskToFirestore(title, priority, combinedDateTime);

      setShowNotification(true);
    } catch (error) {
      console.log(error.message);
      Alert.alert("Failure", "Failed to add task");
    }
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={26} color="#8986a7" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Task</Text>
            <View style={{ width: 26 }} />
          </View>

          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              placeholderTextColor="#8986a7"
              value={title}
              onChangeText={setTitle}
            />

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.dateInput}
            >
              <Text
                style={[
                  styles.dateText,
                  { color: dateSelected ? "#ffffff" : "#8986a7" },
                ]}
              >
                {dateSelected
                  ? format(dueDate, "MMMM dd, yyyy")
                  : "Select a due date"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.dateInput}
            >
              <Text
                style={[
                  styles.dateText,
                  { color: timeSelected ? "#ffffff" : "#8986a7" },
                ]}
              >
                {timeSelected ? format(dueTime, "h:mm a") : "Select a due time"}
              </Text>
            </TouchableOpacity>

            <View style={{ zIndex: 1000, marginBottom: 15 }}>
              <DropDownPicker
                open={priorityDropdownOpen}
                value={priority}
                items={priorityItems}
                setOpen={setPriorityDropdownOpen}
                setValue={setPriority}
                setItems={setPriorityItems}
                placeholder="Select Priority"
                placeholderStyle={{ color: "#8986a7" }}
                textStyle={{ color: "#ffffff" }}
                style={{
                  backgroundColor: "#1e1e2d",
                  borderWidth: 0,
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#1e1e2d",
                  borderWidth: 0,
                }}
                arrowIconStyle={{ tintColor: priority ? "#ffffff" : "#8986a7" }}
                TickIconComponent={() => (
                  <MaterialIcons
                    name="check"
                    size={20}
                    color={priority ? "#ffffff" : "#8986a7"}
                  />
                )}
                listItemLabelStyle={{ color: "#ffffff" }}
                labelStyle={{ color: "#ffffff" }}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddTask}>
              <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
          </View>

          <BottomNavBar />
        </View>
      </SafeAreaView>

      {showPicker && Platform.OS !== "ios" && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate && event.type == "set") {
              setDateSelected(true);
              setDueDate(selectedDate);
            }
          }}
        />
      )}

      {showTimePicker && Platform.OS !== "ios" && (
        <DateTimePicker
          value={dueTime}
          mode="time"
          display="spinner"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime && event.type == "set") {
              setDueTime(selectedTime);
              setTimeSelected(true);
            }
          }}
        />
      )}

      {showPicker && Platform.OS === "ios" && (
        <View style={styles.iosModalOverlay}>
          <View style={styles.iosModalBackground}>
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate && event.type == "set") {
                  setDueTempDate(selectedDate);
                }
              }}
              themeVariant="dark"
            />

            <View style={styles.iosModalButtonRow}>
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                style={{ padding: 5, alignItems: "center" }}
              >
                <Text style={[styles.iosModalButton, { marginRight: 60 }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setDueDate(dueTemptDate);
                  setDateSelected(true);
                  setShowPicker(false);
                }}
                style={{ padding: 5, alignItems: "center" }}
              >
                <Text style={styles.iosModalButton}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showTimePicker && Platform.OS === "ios" && (
        <View style={styles.iosModalOverlay}>
          <View style={styles.iosModalBackground}>
            <DateTimePicker
              value={dueTime}
              mode="time"
              display="spinner"
              onChange={(event, selectedTime) => {
                if (selectedTime && event.type == "set") {
                  setDueTempTime(selectedTime);
                }
              }}
              themeVariant="dark"
            />

            <View style={styles.iosModalButtonRow}>
              <TouchableOpacity
                onPress={() => setShowTimePicker(false)}
                style={{ padding: 5, alignItems: "center" }}
              >
                <Text style={[styles.iosModalButton, { marginRight: 60 }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setDueTime(dueTempTime);
                  setTimeSelected(true);
                  setShowTimePicker(false);
                }}
                style={{ padding: 5, alignItems: "center" }}
              >
                <Text style={styles.iosModalButton}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showNotification && (
        <View style={styles.notificationContainer}>
          <View style={styles.notificationBackground}>
            <Text style={styles.notificationTitle}>
              Task successfully added!
            </Text>

            <FontAwesomeIcon
              name="check-circle"
              size={40}
              color="#cf59a9"
              style={{ marginBottom: 20 }}
            />

            <Text style={styles.notificationMessage}>
              {title
                ? `“${title}” has been added to your tasks.`
                : "Your new task is now saved."}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowNotification(false);
                navigation.navigate("Tasks");
              }}
            >
              <Text style={styles.notificationButton}>Continue to Tasks</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default AddTaskScreen;
