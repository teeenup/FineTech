import { View, Text, ScrollView, Dimensions, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TextField from "@/components/textField";
import CustomButton from "@/components/customButton";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/components/redux/store";
import {
  clearError,
  resetUser,
  signup,
} from "@/components/redux/slices/userSlice";
import { Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { login, message, error, user } = useSelector(
    (state: any) => state.user
  );
  const router = useRouter();

  const onDismissSnackBar = () => {
    setVisible(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!name) {
      setVisible(true);
      setLoading(false);
      setTitle("Name is required");
      return;
    }

    if (!email) {
      setVisible(true);
      setLoading(false);
      setTitle("Email is required");
      return;
    }

    if (!password) {
      setVisible(true);
      setLoading(false);
      setTitle("Password is required");
      return;
    }

    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      setVisible(true);
      setLoading(false);
      setTitle("Invalid email address");
      return;
    }

    try {
      const users = await AsyncStorage.getItem("user");

      const tempUser = users ? await JSON.parse(users) : [];
      if (typeof tempUser === "object") {
        tempUser.forEach((e: any) => {
          if (e.emal === email) {
            setVisible(true);
            setLoading(false);
            setTitle("email id already exists");
          }
        });
      }

      let form;

      let pass = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      let newUser = {
        name,
        email,
        password: pass,
        id: Crypto.randomUUID(),
      };

      if (users) {
        form = [...tempUser, newUser];
      } else {
        form = [newUser];
      }

      await AsyncStorage.setItem("user", JSON.stringify(form));

      dispatch(signup(newUser));
      router.push("/(auth)/setLock");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      setVisible(true);
      setLoading(false);
      setTitle(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.pin) {
        router.push("/(auth)/lockApp");
        return;
      }
      router.push("/(auth)/setLock");
    }
  }, [user]);

  useEffect(() => {
    if (login) {
      setVisible(true);
      setTitle(message);
      dispatch(resetUser());
      router.push("/(auth)/setLock");
    }
    if (error) {
      setVisible(true);
      setTitle(error);
      dispatch(clearError());
    }
  }, [login, error]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView style={{ minHeight: Dimensions.get("screen").height }}>
        <View className="w-full h-full flex px-4 my-6 justify-center items-center">
          <Text className="font-bold text-white text-2xl text-center">
            Register Now!
          </Text>
          <TextField
            title={"Name"}
            handleChange={(e: any) => setName(e)}
            value={name}
            keyboardType="default"
            viewStyle="mt-6 w-full"
          />
          <TextField
            title={"Email"}
            handleChange={(e: any) => setEmail(e)}
            value={email}
            keyboardType="email-address"
            viewStyle="mt-6 w-full"
            caretHidden={false}
          />
          <TextField
            title={"Password"}
            handleChange={(e: any) => setPassword(e)}
            value={password}
            viewStyle="mt-6 w-full"
            keyboardType={
              Platform.OS === "ios" ? "default" : "visible-password"
            }
          />
          <View className="w-full flex justify-center mt-6">
            <CustomButton
              disabled={loading}
              title={loading ? "Loading..." : "Register"}
              onPress={handleSubmit}
            />
          </View>
          <View className="w-full mt-4 flex flex-row justify-center">
            <Text className="text-white text-md">I have an account ?</Text>
            <Link
              href={"/login"}
              className="text-blue-400 hover:underline text-md ml-2"
            >
              Login now
            </Link>
          </View>
          <Snackbar
            className=""
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
              label: "Undo",
              onPress: () => {
                // Do something
              },
            }}
          >
            {title}
          </Snackbar>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
