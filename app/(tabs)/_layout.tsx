import React, { useEffect } from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const backgroundColor = useSharedValue("#000");

  useEffect(() => {
    backgroundColor.value = withTiming("#111827", { duration: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#32CD32",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#111827",
            height: 60,
            borderTopColor: "#222",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Ana Sayfa",
            tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="video-crop"
          options={{
            title: "Video Kırp",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="scissors-cutting" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="details"
          options={{
            title: "Detaylar",
            tabBarIcon: ({ color }) => <FontAwesome name="info-circle" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="edit"
          options={{
            title: "Düzenle",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="pencil" size={28} color={color} />,
          }}
        />
      </Tabs>
    </Animated.View>
  );
}
