import InputField from "@/components/inputField";
import { allCategories, Category } from "@/components/redux/slices/transSlice";
import { AppDispatch } from "@/components/redux/store";
import Slide from "@/components/Slide";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { RadioButton } from "react-native-paper";
// import { Modal } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import * as Crypto from "expo-crypto";

const ManageCategories = () => {
  const [update, setUpdate] = useState<Category | undefined>();
  const [add, setAdd] = useState(false);
  const [deleteCat, setDeleteCat] = useState<Category | undefined>();
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");

  const { categories } = useSelector((state: any) => state.transaction);
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const updateCategory = async () => {
    if (!update) return;
    let tempCategories = categories.map((catego: Category) => {
      if (catego.id === update.id) {
        return { ...catego, name };
      }
      return catego;
    });
    await AsyncStorage.setItem(
      `categories[${user.id}]`,
      JSON.stringify(tempCategories)
    );
    setUpdate(undefined);
    dispatch(allCategories(tempCategories));
  };

  const deleteCategoy = async () => {
    if (!deleteCat) return;
    let tempCategories = categories.filter(
      (catego: Category) => catego.id !== deleteCat.id
    );

    await AsyncStorage.setItem(
      `categories[${user.id}]`,
      JSON.stringify(tempCategories)
    );
    setDeleteCat(undefined);
    dispatch(allCategories(tempCategories));
  };

  const addCategory = async () => {
    if (name === "") {
      Alert.alert("Incomplete", "please fill all required fields");
    }

    let tempCategories = [
      ...categories,
      {
        name,
        type,
        createdAt: new Date(Date.now()).toString(),
        id: Crypto.randomUUID(),
      },
    ];

    await AsyncStorage.setItem(
      `categories[${user.id}]`,
      JSON.stringify(tempCategories)
    );
    setAdd(false);
    dispatch(allCategories(tempCategories));
  };

  useEffect(() => {
    if (update) {
      setName(update.name);
    } else {
      setName("");
    }
  }, [update, add]);

  return (
    <ScrollView
      className="bg-primary"
      // style={{ minHeight: Dimensions.get("screen").height }}
    >
      <View className="w-full min-h-full">
        <View className="items-end">
          <TouchableOpacity
            className="p-2 mt-4 mr-2 rounded-lg items-center min-w-36 w-min border-white border-[1px]"
            onPress={() => setAdd(true)}
          >
            <Text className="color-white">Add Category</Text>
          </TouchableOpacity>
        </View>
        <View className="py-6">
          <View>
            <Text className="font-bold text-center text-2xl color-white">
              Income Categories
            </Text>
          </View>
          <View className="justify-center gap-3 px-3 py-5 items-center w-full">
            {categories
              .filter((cat: Category) => cat.type === "income")
              .map((category: Category) => (
                <View
                  id={category.id}
                  className="flex-row bg-black-100 justify-between px-3 py-4 w-full"
                >
                  {<Text className="color-white">{category.name}</Text>}
                  <View className="flex-row gap-3 justify-between max-w-11 items-center">
                    <TouchableOpacity onPress={() => setUpdate(category)}>
                      <Icon size={22} color={"green"} name="pencil" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDeleteCat(category)}>
                      <Icon size={22} color={"red"} name="delete" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        </View>
        <View className="py-6">
          <View>
            <Text className="font-bold text-center text-2xl color-white">
              Expense Categories
            </Text>
          </View>
          <View className="justify-center gap-3 px-3 py-5 items-center w-full">
            {categories
              .filter((cat: Category) => cat.type === "expense")
              .map((category: Category) => (
                <View className="flex-row bg-black-100 justify-between px-3 py-4 w-full">
                  <Text className="color-white">{category.name}</Text>
                  <View className="flex-row gap-2 justify-between max-w-11 items-center">
                    <TouchableOpacity onPress={() => setUpdate(category)}>
                      <Icon size={22} color={"green"} name="pencil" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDeleteCat(category)}>
                      <Icon size={22} color={"red"} name="delete" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        </View>

        {deleteCat && (
          <Slide open={true} onClose={() => setDeleteCat(undefined)}>
            <Text className="font-bold shadow-slate-100 drop-shadow px-3 py-5 pb-4 text-lg color-white">
              Are You Sure ?
            </Text>
            <View className="py-5 px-2">
              <Text className="font-bold text-white">
                {deleteCat?.name}
                <Text className="pl-2 font-medium">
                  Are you sure to delete this category?{" "}
                </Text>
              </Text>
            </View>
            {/* <View className="w-full h-[1px] opacity-70 bg-black-200" /> */}
            <View className="flex-1 justify-end flex-row w-full p-2 gap-3">
              <TouchableOpacity
                onPress={() => deleteCategoy()}
                className="flex-row items-center px-1 rounded-md bg-red-500"
              >
                <Text className="color-white p-2 text-sm font-bold uppercase">
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeleteCat(undefined)}
                className="flex-row items-center px-1 rounded-md border-white border-[1px]"
              >
                <Text className="p-2 font-bold text-white text-sm uppercase">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Slide>
        )}

        {update && (
          <Slide open={true} onClose={() => setUpdate(undefined)}>
            <Text className="font-bold px-3 py-5 pb-4 text-lg text-center color-white">
              Update Category
            </Text>
            <View className="py-5 px-2">
              <View className={"space-y-2 w-full"}>
                <Text className="text-base text-white">Name</Text>
                <View className="w-full h-10 px-4 rounded-xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
                  <TextInput
                    className="flex-auto flex text-white font-semibold text-base"
                    value={name}
                    onChangeText={(e) => setName(e)}
                  />
                </View>
              </View>
            </View>
            <View className="flex-1 justify-end flex-row w-full p-2 gap-3">
              <TouchableOpacity
                onPress={() => updateCategory()}
                className="flex-row items-center px-1 rounded-md bg-blue-500"
              >
                <Text className="color-white p-2 text-sm font-bold uppercase">
                  Update
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUpdate(undefined)}
                className="flex-row items-center px-1 rounded-md border-white border-[1px]"
              >
                <Text className="p-2 font-bold text-white text-sm uppercase">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Slide>
        )}

        {add && (
          <Slide open={true} onClose={() => setAdd(false)}>
            <Text className="font-bold px-3 py-5 pb-4 text-lg text-center color-white">
              Add Category
            </Text>
            <View className="py-5 px-2">
              <View className={"space-y-2 w-full"}>
                <Text className="text-base text-white">Name</Text>
                <View className="w-full h-10 px-4 rounded-xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
                  <TextInput
                    className="flex-auto flex text-white font-semibold text-base"
                    value={name}
                    onChangeText={(e) => setName(e)}
                  />
                </View>
              </View>
              <View className={`space-y-2 mt-6 w-full`}>
                <Text className="text-base text-gray-100">Type</Text>
                <RadioButton.Group
                  onValueChange={(newValue) => setType(newValue)}
                  value={type}
                >
                  <View className="flex flex-row items-center justify-evenly">
                    <RadioButton.Item
                      labelStyle={{ color: "white" }}
                      label="Expense"
                      value="expense"
                      position="leading"
                      color="red"
                    />
                    <RadioButton.Item
                      labelStyle={{ color: "white" }}
                      color="green"
                      label="Income"
                      value="income"
                      position="leading"
                    />
                  </View>
                </RadioButton.Group>
              </View>
            </View>
            <View className="flex-1 justify-end flex-row w-full p-2 gap-3">
              <TouchableOpacity
                onPress={() => addCategory()}
                className="flex-row items-center min-w-20 justify-center px-1 rounded-md bg-blue-500"
              >
                <Text className="color-white p-2 text-sm font-bold uppercase">
                  Add
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAdd(false)}
                className="flex-row items-center px-1 rounded-md border-white border-[1px]"
              >
                <Text className="p-2 font-bold text-white text-sm uppercase">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Slide>
        )}

        <Text>red</Text>
      </View>
    </ScrollView>
  );
};

export default ManageCategories;
