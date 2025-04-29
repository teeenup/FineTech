import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="profileUpdate"
          options={{ title: "Update Profile" }}
          key={"profileUpdate"}
        />
        <Stack.Screen
          name="manageCategories"
          options={{ title: "Manage Categories" }}
          key={"manageCategories"}
        />
        <Stack.Screen
          name="changePass"
          options={{ title: "Change Password" }}
          key={"changepass"}
        />
        <Stack.Screen
          name="changePin"
          key={"changepin"}
          options={{ title: "Change PIn" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
