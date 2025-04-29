import { View, Text, Dimensions } from "react-native";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "./redux/store";
import { allCategories, allTransactions } from "./redux/slices/transSlice";
import { getError, getUser } from "./redux/slices/userSlice";

const Middleware = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user) {
      if (!user.pin) return router.push("/(auth)/setLock");
      AsyncStorage.getItem(`transaction[${user.id}]`).then(async (res) => {
        if (!res) {
          await AsyncStorage.setItem(
            `transaction[${user.id}]`,
            JSON.stringify([])
          );
        } else {
          let temp = await JSON.parse(res);
          if (temp.length > 0) {
            router.push("/(tabs)");
          }
          dispatch(allTransactions(temp));
        }
      });
      AsyncStorage.getItem(`categories[${user.id}]`).then(async (res) => {
        if (!res) {
          let categories = [
            { id: "2", type: "expense", name: "Mess" },
            { id: "7", type: "expense", name: "Home" },
            { id: "5", type: "expense", name: "Recharge" },
            { id: "3", type: "expense", name: "Room" },
            { id: "1", type: "expense", name: "College" },
            { id: "6", type: "expense", name: "Other" },
            { id: "11", type: "income", name: "Home" },
            { id: "12", type: "income", name: "Milk" },
            { id: "13", type: "income", name: "Farm" },
            { id: "15", type: "income", name: "Job" },
            { id: "16", type: "income", name: "Other" },
          ];
          await AsyncStorage.setItem(
            `categories[${user.id}]`,
            JSON.stringify(categories)
          );
          console.log("first");

          dispatch(allCategories(categories));
          return;
        }
        console.log(res);
        let categories = await JSON.parse(res);
        dispatch(allCategories(categories));
      });
      return () => {};
    }
  }, [user]);

  useEffect(() => {
    const user = AsyncStorage.getItem("user").then(async (use) => {
      try {
        let users = use ? await JSON.parse(use) : "";
        if (users.length > 0) {
          let us = await users.filter((u: any) => !u.pin);
          if (us.length > 0) {
            dispatch(getUser({ lock: us[0], users, length: users.length }));
            router.push("/(auth)/setLock");
          } else {
            dispatch(getUser({ users, length: users.length }));
            router.push("/(auth)/lockApp");
          }
        } else {
          // router.push("/(auth)/login");
          router.push("/(secure)/changePin");
          throw new Error("User not found");
        }
        dispatch(getUser({}));
      } catch (error: any) {
        dispatch(getError({ error: error.message }));
      }
    });

    return () => {};
  }, []);
  return <>{children}</>;
};

export default Middleware;
