import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import "../global.css";

import { Provider } from "react-redux";
import store from "@/components/redux/store";
import Middleware from "@/components/middleware";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // router.push("/(auth)/lockApp");
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Provider store={store}>
        <Middleware>
          <Stack>
            <Stack.Screen
              key={"tabs"}
              name="(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              key={"secure"}
              name="(secure)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              key={"auth"}
              name="(auth)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              key={"not"}
              name="+not-found"
              options={{ headerShown: false }}
            />
          </Stack>
          <StatusBar style="auto" />
        </Middleware>
      </Provider>
    </ThemeProvider>
  );
}
