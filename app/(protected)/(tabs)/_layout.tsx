import React from "react";
import { Tabs } from "expo-router";
import { BottomTabBar } from "../../../src/presentation/components/navigation/BottomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="diary" />
      <Tabs.Screen name="activities" />
      <Tabs.Screen name="patients" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
