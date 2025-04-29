import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { CommonActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import New from "./new";
import Bookmark from "./transactions";
import HomeScreen from "./index";
import Profile from "./profile";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

const Tab = createBottomTabNavigator();

export default function MyComponent() {
  const { user, nUser, loading, secure } = useSelector(
    (state: any) => state.user
  );
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading && !secure) {
      if (nUser > 0) router.push("/(auth)/lockApp");
      return;
    }
    if (user && !loading && !secure) {
      router.push("/(auth)/setLock");
      return;
    }
    if (!user && !loading && nUser === 0) {
      router.push("/(auth)/login");
      return;
    }
  }, [user, loading, nUser]);
  return (
    <>
      {secure && (
        <Tab.Navigator
          key={"tabs"}
          tabBar={({ navigation, state, descriptors, insets }) => (
            <BottomNavigation.Bar
              key={navigation.getId()}
              navigationState={state}
              safeAreaInsets={insets}
              style={{ backgroundColor: "#121218" }}
              activeColor="#FFFFFF"
              inactiveColor="#8E8E93"
              activeIndicatorStyle={{ backgroundColor: "#202028" }}
              onTabPress={({ route, preventDefault }) => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (event.defaultPrevented) {
                  preventDefault();
                } else {
                  navigation.dispatch({
                    ...CommonActions.navigate(route.name, route.params),
                    target: state.key,
                  });
                }
              }}
              renderIcon={({ route, focused, color }) => {
                const { options } = descriptors[route.key];
                if (options.tabBarIcon) {
                  return options.tabBarIcon({ focused, color, size: 24 });
                }

                return null;
              }}
              getLabelText={({ route }) => {
                const { options } = descriptors[route.key];
                const label =
                  typeof options.tabBarLabel === "string"
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route?.name;

                return typeof label === "string" ? label : undefined;
              }}
            />
          )}
        >
          <Tab.Screen
            key={"home"}
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => {
                return <Icon name="home" size={size} color={color} />;
              },
            }}
          />
          <Tab.Screen
            key={"transactions"}
            name="transactions"
            component={Bookmark}
            options={{
              headerTitle: "Transactions",
              tabBarLabel: "Transactions",
              tabBarIcon: ({ color, size }) => {
                return (
                  <Icon name="swap-horizontal" size={size} color={color} />
                );
              },
            }}
          />
          <Tab.Screen
            key={"new"}
            name="new"
            component={New}
            options={{
              headerTitle: "New Transaction",
              tabBarLabel: "New",
              tabBarIcon: ({ color, size }) => {
                return <Icon name="plus" size={size} color={color} />;
              },
            }}
          />
          <Tab.Screen
            key={"profile"}
            name="Profile"
            component={Profile}
            options={{
              tabBarLabel: "Profile",
              tabBarIcon: ({ color, size }) => {
                return <Icon name="account" size={size} color={color} />;
              },
            }}
          />
        </Tab.Navigator>
      )}
    </>
  );
}
