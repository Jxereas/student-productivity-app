import React from "react";
import { View, Text } from "react-native";

const GoalDetailsScreen = ({ route }) => {
  const { goal } = route.params;
  return (
    <View>
      <Text>{goal.title}</Text>
    </View>
  );
};

export default GoalDetailsScreen;
