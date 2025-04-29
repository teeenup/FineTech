import { logout } from "@/components/redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProfilePage = () => {
  const { user, users } = useSelector((state: any) => state.user);
  const { transactions } = useSelector((state: any) => state.transaction);
  const [price, setPrice] = useState(0);

  const router = useRouter();
  const dispatch = useDispatch();

  const logoutAction = async () => {
    let tempUsers = users.map((usr: any) => {
      if (usr.id === user.id) {
        return { ...usr, pin: null };
      }
      return usr;
    });

    await AsyncStorage.setItem("users", JSON.stringify(tempUsers));

    dispatch(logout(tempUsers));
  };

  useEffect(() => {
    setPrice(
      transactions.reduce(
        (acc: any, curr: any) =>
          curr.type === "debit" ? acc - curr.amount : acc + curr.amount,
        0
      )
    );
  }, [transactions]);

  return (
    <>
      <ScrollView className="bg-primary">
        <View className="min-h-screen">
          {/* Profile photo Section */}
          <View className="w-full h-56 flex justify-center flex-col items-center mt-12 mb-10 mx-auto">
            {user.image ? (
              <Image
                source={
                  user.image
                    ? `data:image/jpeg;base64,${user.image.base64}`
                    : require("../../assets/images/r_logo.jpg")
                }
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 100,
                  padding: 10,
                  marginBottom: 10,
                  borderColor: "#161622",
                  borderWidth: 1,
                }}
              />
            ) : (
              <View className="w-36 h-36 justify-center items-center bg-black-200 rounded-full">
                <Icon name="account" color={"white"} size={100} />
              </View>
            )}
            <Text className="text-lg text-white font-bold">{user.name}</Text>
            <Text className="text-base text-gray-400">{user.email}</Text>
          </View>

          {/* Balance Section */}
          <View className="bg-black-200 p-6 rounded-md items-center mb-11">
            <Text className="text-xl text-white">Account Balance</Text>
            <Text
              className={`text-4xl font-bold ${
                price > 0 ? "text-secondary-200" : "text-red-500"
              }`}
            >
              ₹{price}
            </Text>
          </View>

          {/* Actions */}
          <View className="mb-10">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/transactions")}
              className="bg-black-100 p-5 rounded-lg items-center mb-3"
            >
              <Text className="text-white text-base">View Transactions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/new")}
              className="bg-black-100 p-5 rounded-lg items-center mb-3"
            >
              <Text className="text-white text-base">Add Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(secure)/changePin")}
              className="bg-black-100 p-5 rounded-lg items-center mb-3"
            >
              <Text className="text-white text-base">Change Pin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/changePass")}
              className="bg-black-100 p-5 rounded-lg items-center mb-3"
            >
              <Text className="text-white text-base">Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/manageCategories")}
              className="bg-black-100 p-5 rounded-lg items-center mb-3"
            >
              <Text className="text-white text-base">Manage Categories</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profileUpdate")}
              className="bg-black-100 p-5 rounded-lg items-center mb-3"
            >
              <Text className="text-white text-base">Update Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <View className="items-center">
            <TouchableOpacity onPress={logoutAction}>
              <Text className="text-blue-500 mb-5 text-base">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ProfilePage;
