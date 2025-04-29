import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { AppDispatch } from "@/components/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { checkPin, clearError } from "@/components/redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LockApp = () => {
  const [code, setCode] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const codeLength = Array(6).fill(0);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, error, secure, users } = useSelector(
    (state: any) => state.user
  );

  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  const addCode = (number: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode([...code, number]);
  };

  const removeCode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode(code.slice(0, -1));
  };

  const OFFSET = 20;
  const TIME = 80;

  const handleCode = async () => {
    try {
      const users = await AsyncStorage.getItem("user");
      if (users) {
        let user = await JSON.parse(users);

        let tempUser = user.find((u: any) => u.pin === code.join(""));

        if (tempUser) {
          dispatch(checkPin(tempUser));
          return;
        } else {
          throw new Error("Invalid pin");
        }
      } else {
        router.push("/(auth)/login");
      }
    } catch (error: any) {
      offset.value = withSequence(
        withTiming(-OFFSET, { duration: TIME / 2 }),
        withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
        withTiming(0, { duration: TIME / 2 })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (code.length == 6) {
      handleCode();
      if (code.join("") === "123456") {
        // setSecure(true);
        router.push("/(tabs)");
      } else {
      }
      setCode([]);
    }
  }, [code]);

  useEffect(() => {
    if (secure) {
      router.push("/(tabs)");
      return;
    }
    if (error) {
      dispatch(clearError());
      Alert.alert(error);
    }
    setCode([]);
  }, [secure, error]);

  useEffect(() => {
    if (user) {
      router.push("/(tabs)");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (!user.pin) {
        router.push("/(auth)/setLock");
      }
    }
  }, [user]);

  useEffect(() => {
    if (!users) {
      router.push("/(auth)/login");
    }
  }, [users]);

  // const bioAuth = async () => {
  //   const { success } = await LocalAuthentication.authenticateAsync();
  //   if (success) {
  //     setSecure(true);
  //   } else {
  //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  //   }
  // };

  return (
    <SafeAreaView className="bg-primary flex-1 ">
      <View className="justify-between h-full flex-col py-10">
        <View className="flex-col pt-20">
          <Text className="text-xl font-bold text-center text-white">
            Enter your code
          </Text>
          <Animated.View
            className="flex flex-row items-center justify-center gap-3"
            style={[
              {
                flex: 1,
                marginTop: 70,
                marginBottom: 20,
                justifyContent: "center",
                flexDirection: "row",
              },
              style.transform,
            ]}
          >
            {/* Lock screen content */}
            {codeLength.map((_, index) => (
              <View
                key={index}
                className="bg-white rounded-full w-4 h-4 mx-2"
                style={{ backgroundColor: code[index] ? "#fff" : "gray" }}
              />
            ))}
          </Animated.View>
          {errorMessage && (
            <Text className="text-red-500 pt-12 text-center">
              {errorMessage}
            </Text>
          )}
        </View>
        <View className="flex-col justify-center mx-10 gap-2 mt-10">
          <View className="flex-row justify-between gap-2">
            {[1, 2, 3].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => addCode(number)}
                className="w-16 h-16 items-center justify-center p-2"
              >
                <Text className="text-3xl text-white">{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row justify-between gap-2">
            {[4, 5, 6].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => addCode(number)}
                className="w-16 h-16 items-center justify-center p-2"
              >
                <Text className="text-3xl text-white">{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row justify-between gap-2">
            {[7, 8, 9].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => addCode(number)}
                className="w-16 h-16 items-center justify-center p-2"
              >
                <Text className="text-3xl text-white">{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row justify-between gap-2">
            <TouchableOpacity
              // onPress={bioAuth}
              className="w-16 h-16 items-center justify-center p-2"
            >
              {/* <Icon
                name="face-recognition"
                size={24}
                color={"white"}
                className="text-3xl text-center text-white"
              /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => addCode(0)}
              className="w-16 h-16 items-center justify-center p-2"
            >
              <Text className="text-3xl text-white">0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => removeCode()}
              className="w-16 h-16 items-center justify-center p-2"
            >
              <Icon
                name="backspace"
                size={24}
                color={"white"}
                className="text-3xl text-center text-white"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="pb-3 pt-5"
          >
            <Text className="text-white hover:underline text-center">
              Forgot your code?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LockApp;
