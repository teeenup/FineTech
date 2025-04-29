import { View, Text, ScrollView, Dimensions, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TextField from "@/components/textField";
import CustomButton from "@/components/customButton";
import { Link, useRouter } from "expo-router";
import { AppDispatch } from "@/components/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  changeProfile,
  clearError,
  loginAction,
} from "@/components/redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const Login = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, users } = useSelector((state: any) => state.user);

  const submitHandler = async () => {
    setLoading(true);

    if (!password) {
      setLoading(false);
      Alert.alert("Current Password is required");
      return;
    }
    if (!newPassword) {
      setLoading(false);
      Alert.alert("New Password is required");
      return;
    }
    if (!confPassword) {
      setLoading(false);
      Alert.alert("Confirm Password is required");
      return;
    }

    let hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    if (hashedPassword !== password) {
      Alert.alert("Current Password is incorrect");
      setLoading(false);
      return;
    }

    if (newPassword === password) {
      Alert.alert("Current password and new password can not be match");
      setLoading(false);
      return;
    }

    if (newPassword !== confPassword) {
      setLoading(false);
      Alert.alert("New Password and Confirm Password do not match");
      return;
    }

    let pass = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      newPassword
    );

    let tempUser = { ...user, password: pass };

    try {
      let ind = await users.map((u: any) => (u.id === user.id ? tempUser : u));
      await AsyncStorage.setItem("user", JSON.stringify(ind));
      await dispatch(changeProfile(tempUser));
      Alert.alert("Password changed successfully");
      router.push("/(tabs)/profile");
    } catch (error) {
      Alert.alert("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/profile");
    }
  }, [user]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView style={{ minHeight: Dimensions.get("screen").height }}>
        <View className="w-full h-full flex px-4 my-6 justify-center items-center">
          <Text className="font-bold text-white text-2xl text-center">
            Change Password
          </Text>

          <TextField
            title={"Current Password"}
            handleChange={(e: any) => setPassword(e)}
            value={password}
            viewStyle="mt-6 w-full"
            type="password"
          />
          <TextField
            title={"New Password"}
            handleChange={(e: any) => setNewPassword(e)}
            value={newPassword}
            viewStyle="mt-6 w-full"
            type="password"
          />
          <TextField
            title={"Confirm Password"}
            handleChange={(e: any) => setConfPassword(e)}
            value={confPassword}
            viewStyle="mt-6 w-full"
            type="password"
          />
          <View className="w-full flex justify-center mt-6">
            <CustomButton
              title="Change Password"
              onPress={submitHandler}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
