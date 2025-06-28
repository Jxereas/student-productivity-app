import React, { useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { View, TouchableOpacity } from "react-native";
import Animated, { runOnJS } from "react-native-reanimated";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "../styles/SwipeableTaskCard";
import {
  useAnimatedReaction,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
} from "react-native-reanimated";

const triggerMediumHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

const triggerLightHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const SwipeableTaskCard = ({
  task,
  onEdit,
  onDelete,
  onComplete,
  children,
}) => {
  const containerWidthRef = useRef(1);
  const hasCrossedThreshold = useRef(false);
  const [leftThreshold, setLeftThreshold] = useState(1);
  const swipeableRef = useRef(null);

  const handleSwipeableOpen = () => {
        console.log("handling open");
    // Default width fallback
    const width = containerWidthRef.current;

    // How far the card swiped in % (0 to 1)
    // const swipeDistance = swipeableRef.current.__lastOffsetX ?? 0;
    // const percent = swipeDistance / width;
    //
    // if (percent < 0.6) {
      // Snap open to fixed 60px position
      swipeableRef.current?.openLeft(60);
    // } else {
    //   // Else, full swipe behavior (auto-complete logic later)
    // }
  };

  const renderLeftActions = (progress, dragX) => {
    useAnimatedReaction(
      () => progress.value,
      (value) => {
        const threshold = 0.6;

        if (value >= threshold && !hasCrossedThreshold.value) {
          hasCrossedThreshold.value = true;
          runOnJS(triggerMediumHaptic)();
        } else if (value <= threshold && hasCrossedThreshold.value) {
          hasCrossedThreshold.value = false;
          runOnJS(triggerLightHaptic)();
        }
      },
      [],
    );

    const containerAnimatedStyle = useAnimatedStyle(() => {
      const bgColor = interpolateColor(
        progress.value,
        [0, 0.6],
        ["#ffb3da", "#ff6bcb"],
      );

      return {
        backgroundColor: bgColor,
      };
    });

    const iconAnimatedStyle = useAnimatedStyle(() => {
      const clampedTranslateX = interpolate(
        progress.value,
        [0.2, 0.7],
        [0, containerWidthRef.current * 0.5 - 30],
        Extrapolation.CLAMP,
      );

      return {
        transform: [{ translateX: clampedTranslateX }],
      };
    });

    return (
      <Animated.View
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width;
          containerWidthRef.current = width;
          setLeftThreshold(width * 0.2);
        }}
        style={[styles.leftActionContainer, containerAnimatedStyle]}
      >
        <Animated.View style={[styles.completeBox, iconAnimatedStyle]}>
          <TouchableOpacity
            onPress={() => {
              onComplete(task);
            }}
          >
            <Icon name="checkmark" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderRightActions = () => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity onPress={() => onEdit(task)} style={styles.editBox}>
        <Icon name="pencil" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(task)} style={styles.deleteBox}>
        <Icon name="trash" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      friction={1}
      leftThreshold={leftThreshold}
      overshootLeft={false}
      onSwipeableOpen={handleSwipeableOpen}
    >
      {children}
    </Swipeable>
  );
};

export default SwipeableTaskCard;
