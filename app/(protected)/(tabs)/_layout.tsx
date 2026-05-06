import React from "react";
import { Tabs } from "expo-router";
import { NavigationProvider } from "../../../src/presentation/context/NavigationContext";
import { SideMenu } from "../../../src/presentation/components/navigation/SideMenu";
import { BottomTabBar } from "../../../src/presentation/components/navigation/BottomTabBar";

export default function TabsLayout() {
  return (
    <NavigationProvider>
      <SideMenu />
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
    </NavigationProvider>
  );
}
