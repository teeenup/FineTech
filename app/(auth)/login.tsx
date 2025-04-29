import { View, Text, ScrollView, Dimensions, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TextField from "@/components/textField";
import CustomButton from "@/components/customButton";
import { Link, useRouter } from "expo-router";
import { AppDispatch } from "@/components/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginAction } from "@/components/redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { login, message, error, user } = useSelector(
    (state: any) => state.user
  );

  const submitHandler = async () => {
    setLoading(true);
    if (!email) {
      setLoading(false);
      Alert.alert("Email is required");
      return;
    }
    if (!password) {
      setLoading(false);
      Alert.alert("Password is required");
      return;
    }

    try {
      const users = await AsyncStorage.getItem("user");
      if (!users) {
        setLoading(false);
        return;
      }
      const users2 = JSON.parse(users);
      const index = users2.findIndex((item: any) => item.email === email);
      if (index === -1) {
        setLoading(false);
        return;
      }
      const tempUser = users2[index];

      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      if (hashedPassword !== password) {
        throw new Error("Invalid password");
      }

      if (tempUser.pin) {
        tempUser.pin = null;
      }

      dispatch(loginAction({ user: tempUser }));
      Alert.alert("Login successful");
    } catch (error: any) {
      Alert.alert(error.message);
    }

    dispatch(loginAction({ email, password }));
  };

  useEffect(() => {
    if (login) {
      if (user) {
        if (!user.pin) router.push("/(auth)/setLock");
        router.push("/(tabs)");
      }
    }
    if (error) {
      Alert.alert(error);
      dispatch(clearError());
    }
  }, [login, error]);

  useEffect(() => {
    if (user) {
      if (user.pin) {
        router.push("/(auth)/lockApp");
        return;
      }
      router.push("/(auth)/setLock");
    }
  }, [user]);
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView style={{ minHeight: Dimensions.get("screen").height }}>
        <View className="w-full h-full flex px-4 my-6 justify-center items-center">
          <Text className="font-bold text-white text-2xl text-center">
            Login Now!
          </Text>
          <TextField
            title={"Email"}
            handleChange={(e: any) => setEmail(e)}
            value={email}
            keyboardType="email-address"
            viewStyle="mt-6 w-full"
          />
          <TextField
            title={"Password"}
            handleChange={(e: any) => setPassword(e)}
            value={password}
            viewStyle="mt-6 w-full"
            type="password"
          />
          <View className="w-full flex justify-center mt-6">
            <CustomButton
              title="Login"
              onPress={submitHandler}
              disabled={loading}
            />
          </View>
          <View className="w-full mt-4 flex flex-row justify-center">
            <Text className="text-white text-md">
              I don't have any account ?
            </Text>
            <Link
              href={"/register"}
              className="text-blue-400 hover:underline text-md ml-2"
            >
              Register now
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
