import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/SearchGoals";
import BottomNavBar from "./BottomNavBar";

function combineDateAndTime(date, time) {
  if (!date && !time) return null;

  const baseDate = date || new Date(); // If no date, use today
  const baseTime = time || new Date(0); // If no time, use midnight

  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    baseTime.getHours(),
    baseTime.getMinutes(),
  );
}

const GoalSearchScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");

  const [createdAfter, setCreatedAfter] = useState(null);
  const [createdBefore, setCreatedBefore] = useState(null);
  const [dueAfter, setDueAfter] = useState(null);
  const [dueBefore, setDueBefore] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null); // 'createdAfter', 'createdBefore', etc.
  const [tempDate, setTempDate] = useState(new Date());

  const [createdAfterTime, setCreatedAfterTime] = useState(null);
  const [createdBeforeTime, setCreatedBeforeTime] = useState(null);
  const [dueAfterTime, setDueAfterTime] = useState(null);
  const [dueBeforeTime, setDueBeforeTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTimeField, setCurrentTimeField] = useState(null);
  const [tempTime, setTempTime] = useState(new Date());

  const [dueToday, setDueToday] = useState(false);
  const [dueThisWeek, setDueThisWeek] = useState(false);
  const [overdue, setOverdue] = useState(false);

  const toggleCheckbox = (checkboxSetter, checkboxesToClear) => {
    checkboxSetter((prev) => {
      checkboxesToClear.forEach((clearSetter) => clearSetter(false));
      return !prev;
    });
  };

  const openDatePicker = (field, existingDate) => {
    setCurrentDateField(field);
    setTempDate(existingDate || new Date());
    setShowDatePicker(true);
  };

  const applyDateChange = () => {
    switch (currentDateField) {
      case "createdAfter":
        setCreatedAfter(tempDate);
        break;
      case "createdBefore":
        setCreatedBefore(tempDate);
        break;
      case "dueAfter":
        setDueAfter(tempDate);
        break;
      case "dueBefore":
        setDueBefore(tempDate);
        break;
    }
  };

  const openTimePicker = (field, existingTime) => {
    setCurrentTimeField(field);
    setTempTime(existingTime || new Date());
    setShowTimePicker(true);
  };

  const applyTimeChange = () => {
    switch (currentTimeField) {
      case "createdAfterTime":
        setCreatedAfterTime(tempTime);
        break;
      case "createdBeforeTime":
        setCreatedBeforeTime(tempTime);
        break;
      case "dueAfterTime":
        setDueAfterTime(tempTime);
        break;
      case "dueBeforeTime":
        setDueBeforeTime(tempTime);
        break;
    }
  };

  const handleSearch = () => {
    const serializeDate = (date) => (date ? date.toISOString() : null);

    const filters = {
      title: title.trim() !== "" ? title.trim() : null,
      createdAfter: serializeDate(
        combineDateAndTime(createdAfter, createdAfterTime),
      ),
      createdBefore: serializeDate(
        combineDateAndTime(createdBefore, createdBeforeTime),
      ),
      dueAfter: serializeDate(combineDateAndTime(dueAfter, dueAfterTime)),
      dueBefore: serializeDate(combineDateAndTime(dueBefore, dueBeforeTime)),
      dueToday,
      dueThisWeek,
      overdue,
    };

    navigation.navigate("SearchGoalsResults", { filters });
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <View style={styles.titleContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("Goals")}>
                <Icon name="arrow-back" size={26} color="#8986a7" />
              </TouchableOpacity>
              <Text style={styles.title}>Search Goals</Text>
              <View style={{ width: 26 }} />
            </View>

            <ScrollView
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Goal Title</Text>
              <View style={styles.inputWithClear}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter goal title"
                  placeholderTextColor="#8986a7"
                  value={title}
                  onChangeText={setTitle}
                />
                {title !== "" && (
                  <TouchableOpacity onPress={() => setTitle("")}>
                    <Icon
                      name="close-circle"
                      size={20}
                      color="#8986a7"
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Created After</Text>
              <View style={styles.inputWithClear}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => openDatePicker("createdAfter", createdAfter)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      createdAfter && { color: "#ffffff" },
                    ]}
                  >
                    {createdAfter
                      ? createdAfter.toDateString()
                      : "Select a date"}
                  </Text>
                </TouchableOpacity>

                {createdAfter && (
                  <TouchableOpacity onPress={() => setCreatedAfter(null)}>
                    <Icon
                      name="close-circle"
                      size={20}
                      color="#8986a7"
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWithClear}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() =>
                    openTimePicker("createdAfterTime", createdAfterTime)
                  }
                >
                  <Text
                    style={[
                      styles.dateText,
                      createdAfterTime && { color: "#ffffff" },
                    ]}
                  >
                    {createdAfterTime
                      ? createdAfterTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select a time"}
                  </Text>
                </TouchableOpacity>

                {createdAfterTime && (
                  <TouchableOpacity onPress={() => setCreatedAfterTime(null)}>
                    <Icon
                      name="close-circle"
                      size={20}
                      color="#8986a7"
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Created Before</Text>
              <View style={styles.inputWithClear}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => openDatePicker("createdBefore", createdBefore)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      createdBefore && { color: "#ffffff" },
                    ]}
                  >
                    {createdBefore
                      ? createdBefore.toDateString()
                      : "Select a date"}
                  </Text>
                </TouchableOpacity>

                {createdBefore && (
                  <TouchableOpacity onPress={() => setCreatedBefore(null)}>
                    <Icon
                      name="close-circle"
                      size={20}
                      color="#8986a7"
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWithClear}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() =>
                    openTimePicker("createdBeforeTime", createdBeforeTime)
                  }
                >
                  <Text
                    style={[
                      styles.dateText,
                      createdBeforeTime && { color: "#ffffff" },
                    ]}
                  >
                    {createdBeforeTime
                      ? createdBeforeTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select a time"}
                  </Text>
                </TouchableOpacity>

                {createdBeforeTime && (
                  <TouchableOpacity onPress={() => setCreatedBeforeTime(null)}>
                    <Icon
                      name="close-circle"
                      size={20}
                      color="#8986a7"
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Due After</Text>
              <View style={styles.inputWithClear}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => openDatePicker("dueAfter", dueAfter)}
                >
                  <Text
                    style={[styles.dateText, dueAfter && { color: "#ffffff" }]}
                  >
                    {dueAfter ? dueAfter.toDateString() : "Select a date"}
                  </Text>
                </TouchableOpacity>

                {dueAfter && (
                  <TouchableOpacity onPress={() => setDueAfter(null)}>
                    <Icon
                      name="close-circle"
                      size={20}
                      color="#8986a7"
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWithClear}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => openTimePicker("dueAfterTime", dueAfterTime)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      dueAfterTime && { color: "#ffffff" },
                    ]}
                  >
                    {dueAfterTime
                      ? dueAfterTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select a time"}
                  </Text>
                </TouchableOpacity>

                {dueAfterTime && (
                  <TouchableOpacity onPress={() => setDueAfterTime(null)}>
                    <Icon
                      name="close-circle"
                      size={20}
                      color="#8986a7"
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Due Before</Text>
              <View style={styles.inputWithClear}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => openDatePicker("dueBefore", dueBefore)}
                >
                  <Text
                    style={[styles.dateText, dueBefore && { color: "#ffffff" }]}
                  >
                    {dueBefore ? dueBefore.toDateString() : "Select a date"}
                  </Text>
                </TouchableOpacity>

                {dueBefore && (
                  <TouchableOpacity onPress={() => setDueBefore(null)}>
                    <Icon
                      name="close-circle"
                      size={20}
                      color="#8986a7"
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWithClear}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => openTimePicker("dueBeforeTime", dueBeforeTime)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      dueBeforeTime && { color: "#ffffff" },
                    ]}
                  >
                    {dueBeforeTime
                      ? dueBeforeTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select a time"}
                  </Text>
                </TouchableOpacity>

                {dueBeforeTime && (
                  <TouchableOpacity onPress={() => setDueBeforeTime(null)}>
                    <Icon
                      name="close-circle"
                      size={20}
                      color="#8986a7"
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Quick Filters</Text>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkboxRow}>
                  <Text
                    style={[
                      styles.checkboxLabel,
                      dueToday && { color: "#ffffff" },
                    ]}
                  >
                    Due Today
                  </Text>
                  <Checkbox
                    color={"#cf59a9"}
                    value={dueToday}
                    onValueChange={() =>
                      toggleCheckbox(setDueToday, [setDueThisWeek, setOverdue])
                    }
                  />
                </View>

                <View style={styles.checkboxRow}>
                  <Text
                    style={[
                      styles.checkboxLabel,
                      dueThisWeek && { color: "#ffffff" },
                    ]}
                  >
                    Due This Week
                  </Text>
                  <Checkbox
                    color={"#cf59a9"}
                    value={dueThisWeek}
                    onValueChange={() =>
                      toggleCheckbox(setDueThisWeek, [setDueToday, setOverdue])
                    }
                  />
                </View>

                <View style={[styles.checkboxRow, { marginBottom: 0 }]}>
                  <Text
                    style={[
                      styles.checkboxLabel,
                      overdue && { color: "#ffffff" },
                    ]}
                  >
                    Overdue
                  </Text>
                  <Checkbox
                    color={"#cf59a9"}
                    value={overdue}
                    onValueChange={() =>
                      toggleCheckbox(setOverdue, [setDueToday, setDueThisWeek])
                    }
                  />
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
              <Text style={styles.buttonText}>Search Goals</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>

          <BottomNavBar />
        </View>
      </SafeAreaView>

      {showDatePicker && Platform.OS !== "ios" && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate && event.type === "set") {
              switch (currentDateField) {
                case "createdAfter":
                  setCreatedAfter(selectedDate);
                  break;
                case "createdBefore":
                  setCreatedBefore(selectedDate);
                  break;
                case "dueAfter":
                  setDueAfter(selectedDate);
                  break;
                case "dueBefore":
                  setDueBefore(selectedDate);
                  break;
              }
            }
          }}
        />
      )}

      {showDatePicker && Platform.OS === "ios" && (
        <View style={styles.iosModalOverlay}>
          <View style={styles.iosModalBackground}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate && event.type === "set") {
                  setTempDate(selectedDate);
                }
              }}
              themeVariant="dark"
            />
            <View style={styles.iosModalButtonRow}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={{ padding: 5, alignItems: "center" }}
              >
                <Text style={[styles.iosModalButton, { marginRight: 60 }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(false);
                  applyDateChange();
                }}
                style={{ padding: 5, alignItems: "center" }}
              >
                <Text style={styles.iosModalButton}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showTimePicker && Platform.OS !== "ios" && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          display="spinner"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime && event.type === "set") {
              switch (currentTimeField) {
                case "createdAfterTime":
                  setCreatedAfterTime(selectedTime);
                  break;
                case "createdBeforeTime":
                  setCreatedBeforeTime(selectedTime);
                  break;
                case "dueAfterTime":
                  setDueAfterTime(selectedTime);
                  break;
                case "dueBeforeTime":
                  setDueBeforeTime(selectedTime);
                  break;
              }
            }
          }}
        />
      )}

      {showTimePicker && Platform.OS === "ios" && (
        <View style={styles.iosModalOverlay}>
          <View style={styles.iosModalBackground}>
            <DateTimePicker
              value={tempTime}
              mode="time"
              display="spinner"
              onChange={(event, selectedTime) => {
                if (selectedTime && event.type === "set") {
                  setTempTime(selectedTime);
                }
              }}
              themeVariant="dark"
            />
            <View style={styles.iosModalButtonRow}>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text style={[styles.iosModalButton, { marginRight: 60 }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowTimePicker(false);
                  applyTimeChange();
                }}
              >
                <Text style={styles.iosModalButton}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default GoalSearchScreen;
