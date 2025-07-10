import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  runOnJS,
  Extrapolation,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { deleteGoal, setGoalCompleted } from "../utility/FirebaseHelpers";
import styles from "../styles/GoalCard";

const GoalCard = ({ goal, tasks, onDelete, isLast }) => {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [isCompleted, setIsCompleted] = useState(goal.completed);

  const hasTriggeredHapticRight = useRef(false);
  const hasTriggeredHapticLeft = useRef(false);

  const [progress, setProgress] = useState(() => {
    const relatedTasks = tasks.filter((task) => task.goalId === goal.id);
    const completed = relatedTasks.filter((t) => t.completed).length;
    const total = relatedTasks.length;
    const percent = total === 0 ? 0 : (completed / total) * 100;

    return { completed, total, percent };
  });

  const navigation = useNavigation();

  const handleGoalPressed = () => {
    navigation.navigate("GoalDetails", {
      goalId: goal.id,
    });
  };

  const handleComplete = async () => {
    try {
      await setGoalCompleted(goal, !isCompleted);
      setIsCompleted(!isCompleted);
      translateX.value = withTiming(0);

      const newCompleted = !isCompleted ? progress.total : 0;
      const newPercent =
        progress.total === 0 ? 0 : (newCompleted / progress.total) * 100;

      setProgress({
        completed: newCompleted,
        total: progress.total,
        percent: newPercent,
      });
    } catch (error) {
      Alert.alert("Completion Failed", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(goal.id);
      if (onDelete) onDelete();
    } catch (error) {
      Alert.alert("Deletion Failed", error.message);
    }
  };

  const handleEdit = () => {
    const serializeDate = (date) => (date ? date.toISOString() : null);

    const subTasks = tasks
      .filter((task) => task.goalId === goal.id)
      .map((task) => ({
        ...task,
        dueAt: serializeDate(task.dueAt),
      }));

    navigation.navigate("EditGoal", {
      goal: {
        id: goal.id,
        title: goal.title.trim() !== "" ? goal.title.trim() : null,
        dueAt: serializeDate(goal.dueAt),
      },
      subTasks,
    });
  };

  const panGesture = Gesture.Pan()
    .minDistance(20)
    .onStart(() => {
      startX.value = translateX.value;
      hasTriggeredHapticRight.current = false;
      hasTriggeredHapticLeft.current = false;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;

      translateX.value = Math.min(
        Math.max(translateX.value, -cardWidth),
        cardWidth,
      );

      const rightThreshold = cardWidth * 0.6;
      if (
        translateX.value > rightThreshold &&
        !hasTriggeredHapticRight.current
      ) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        hasTriggeredHapticRight.current = true;
      }
      if (
        translateX.value < rightThreshold &&
        hasTriggeredHapticRight.current
      ) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        hasTriggeredHapticRight.current = false;
      }

      const leftThreshold = -cardWidth * 0.6;
      if (translateX.value < leftThreshold && !hasTriggeredHapticLeft.current) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        hasTriggeredHapticLeft.current = true;
      }
      if (translateX.value > leftThreshold && hasTriggeredHapticLeft.current) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        hasTriggeredHapticLeft.current = false;
      }
    })
    .onEnd(() => {
      const rightSnap = cardWidth * 0.2;
      const rightAction = cardWidth * 0.6;

      const leftSnap = -cardWidth * 0.2;
      const autoDelete = -cardWidth * 0.6;

      if (translateX.value > rightAction) {
        translateX.value = withTiming(cardWidth, {}, () =>
          runOnJS(handleComplete)(),
        );
      } else if (translateX.value > rightSnap) {
        translateX.value = withTiming(60);
      } else if (translateX.value < autoDelete) {
        translateX.value = withTiming(-cardWidth, {}, () =>
          runOnJS(handleDelete)(),
        );
      } else if (translateX.value < leftSnap) {
        translateX.value = withTiming(-120); // keep partially open left
      } else {
        translateX.value = withTiming(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const borderBottomLeftRadius = interpolate(
      translateX.value,
      [0, 12],
      [12, 0],
      Extrapolation.CLAMP,
    );

    const borderTopLeftRadius = interpolate(
      translateX.value,
      [0, 12],
      [12, 0],
      Extrapolation.CLAMP,
    );

    const borderBottomRightRadius = interpolate(
      translateX.value,
      [-12, 0],
      [0, 12],
      Extrapolation.CLAMP,
    );

    const borderTopRightRadius = interpolate(
      translateX.value,
      [0, -12],
      [12, 0],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateX: translateX.value }],
      borderBottomLeftRadius,
      borderTopLeftRadius,
      borderBottomRightRadius,
      borderTopRightRadius,
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    const midPoint = cardWidth * 0.5;
    const start = cardWidth * 0.2;
    const end = cardWidth * 0.6;
    const maxTranslate = midPoint - 30;

    let translate = 0;

    if (translateX.value >= start && translateX.value < end) {
      translate = interpolate(
        translateX.value,
        [start, end],
        [0, maxTranslate],
        Extrapolation.CLAMP,
      );
    } else if (translateX.value >= end) {
      translate = maxTranslate;
    }

    return {
      transform: [{ translateX: translate }],
    };
  });

  const editButtonStyle = useAnimatedStyle(() => {
    const swipe = translateX.value;
    const revealed = Math.abs(swipe);

    const tStart = cardWidth * 0.55;
    const tEnd = cardWidth * 0.65;
    const halfWidth = revealed / 2;

    // Freeze width during fade-out
    const width =
      revealed < tStart
        ? halfWidth
        : revealed < tEnd
          ? tStart / 2 // Hold last half-width until fade completes
          : 0;

    const opacity = interpolate(
      revealed,
      [tStart, tEnd],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      width,
      opacity,
    };
  });

  const deleteButtonStyle = useAnimatedStyle(() => {
    const swipe = translateX.value;
    const revealed = Math.abs(swipe);
    const threshold = cardWidth * 0.6;

    // Define a small blend zone around the threshold (±10%)
    const tStart = cardWidth * 0.55;
    const tEnd = cardWidth * 0.65;

    // Interpolate delete width from 50% to 100% in this zone
    const interpolatedWidth = interpolate(
      revealed,
      [tStart, tEnd],
      [revealed / 2, revealed],
      Extrapolation.CLAMP,
    );

    const borderBottomLeftRadius = interpolate(
      revealed,
      [cardWidth - 12, cardWidth],
      [0, 12],
      Extrapolation.CLAMP,
    );

    const borderTopLeftRadius = interpolate(
      revealed,
      [cardWidth - 12, cardWidth],
      [0, 12],
      Extrapolation.CLAMP,
    );

    const width = revealed < tStart ? revealed / 2 : interpolatedWidth;

    return {
      width,
      borderBottomLeftRadius,
      borderTopLeftRadius,
    };
  });

  const animatedRightStyle = useAnimatedStyle(() => {
    const r = interpolate(
      translateX.value,
      [0, cardWidth * 0.2],
      [255, 255],
      Extrapolation.CLAMP,
    );

    const g = interpolate(
      translateX.value,
      [0, cardWidth * 0.2],
      [179, 107],
      Extrapolation.CLAMP,
    );

    const b = interpolate(
      translateX.value,
      [0, cardWidth * 0.2],
      [218, 203],
      Extrapolation.CLAMP,
    );

    const backgroundColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

    return {
      opacity: translateX.value > 0 ? 1 : 0,
      zIndex: translateX.value > 0 ? 0 : -1,
      backgroundColor,
    };
  });

  const animatedLeftStyle = useAnimatedStyle(() => {
    return {
      opacity: translateX.value < 0 ? 1 : 0,
      zIndex: translateX.value < 0 ? 0 : -1,
    };
  });

  return (
    <View
      style={[styles.cardContainer, isLast && { marginBottom: 0 }]}
      onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
    >
      {/* Right swipe background (Complete) */}
      <Animated.View style={[styles.rightActionContainer, animatedRightStyle]}>
        <TouchableOpacity onPress={handleComplete}>
          <Animated.View style={[styles.checkmarkBox, checkmarkStyle]}>
            <Icon name="checkmark" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Left swipe background (Edit + Delete) */}
      <Animated.View style={[styles.leftActionContainer, animatedLeftStyle]}>
        <TouchableOpacity onPress={handleDelete}>
          <Animated.View style={[styles.deleteBox, deleteButtonStyle]}>
            <Icon name="trash" size={22} color="white" />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEdit}>
          <Animated.View style={[styles.editBox, editButtonStyle]}>
            <Icon name="pencil" size={22} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Foreground swipeable card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.goalCard,
            cardStyle,
            isCompleted && { backgroundColor: "2b2b2b" },
          ]}
        >
          <TouchableOpacity onPress={handleGoalPressed}>
            <Text
              style={[
                styles.goalTitle,
                isCompleted && {
                  textDecorationLine: "line-through",
                  color: "#777",
                },
              ]}
            >
              {goal.title}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <LinearGradient
                  colors={["#cf59a9", "#d385b3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBarFill,
                    { width: `${progress.percent}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {progress.completed}/{progress.total}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default GoalCard;
