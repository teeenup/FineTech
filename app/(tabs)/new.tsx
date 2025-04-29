import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/inputField";
import CustomButton from "@/components/customButton";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { SelectList } from "react-native-dropdown-select-list";
import { RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/components/redux/store";
import { addTransaction } from "@/components/redux/slices/transSlice";
import * as Crypto from "expo-crypto";

const New = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("debit");
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [categoryType, setCategoryType] = useState<any>([]);

  const { user } = useSelector((state: any) => state.user);
  const { categories } = useSelector((state: any) => state.transaction);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (type !== "all") {
      setCategoryType([
        ...categories
          .filter(
            (cat: any) =>
              cat.type === (type === "credit" ? "income" : "expense")
          )
          .map((cat: any) => cat.name),
      ]);
    }
  }, [type]);

  const submitHandler = async () => {
    setLoading(true);

    if (!name) {
      Alert.alert("Name is required");
      setLoading(false);
      return;
    }
    if (!amount) {
      Alert.alert("Amount is required");
      setLoading(false);
      return;
    }
    if (!date) {
      Alert.alert("Date is required");
      setLoading(false);
      return;
    }

    if (!category) {
      Alert.alert("Category is required");
      setLoading(false);
      return;
    }

    let form = {
      name,
      amount: Number(amount),
      date: date.toDateString(),
      category,
      description,
      id: Crypto.randomUUID(),
      type,
      user: user.id,
    };
    try {
      let storage: any = await AsyncStorage.getItem(`transaction[${user.id}]`);
      if (storage) {
        storage = await JSON.parse(storage);
        storage = [...storage, form];
      } else {
        storage = [form];
      }

      // add data in async storage
      await AsyncStorage.setItem(
        `transaction[${user.id}]`,
        JSON.stringify(storage)
      );
      dispatch(addTransaction(form));
    } catch (error) {
      setLoading(false);
      Alert.alert("Error Creating Transaction");
      return;
    }
    Alert.alert("Transaction Created Successfully");
    setLoading(false);
    setName("");
    setCategory("");
    setAmount("");
    setDescription("");
  };
  return (
    <SafeAreaView className="bg-primary pb-20 min-h-screen  h-full">
      <ScrollView>
        <KeyboardAvoidingView
          // behavior={Platform.OS === "ios" ? "padding" : "padding"}
          style={{ flex: 1 }}
        >
          <View className="px-4 pb-10">
            {/* <Text className="font-bold text-white text-2xl text-center">
              Create Transaction
            </Text> */}
            <InputField
              title={"Name"}
              handleChange={(e: any) => setName(e)}
              value={name}
              keyboardType="text"
              viewStyle="mt-6 w-full"
            />
            <InputField
              title={"Amount"}
              handleChange={(e: any) => setAmount(e)}
              value={amount}
              keyboardType="decimal-pad"
              viewStyle="mt-6 w-full"
            />
            <View className={`space-y-2 mt-6 w-full`}>
              <Text className="text-base text-gray-100">Type</Text>
              <RadioButton.Group
                onValueChange={(newValue) => setType(newValue)}
                value={type}
              >
                <View className="flex flex-row items-center justify-evenly">
                  <RadioButton.Item
                    labelStyle={{ color: "white" }}
                    label="Debit"
                    value="debit"
                    position="leading"
                    color="red"
                  />
                  <RadioButton.Item
                    labelStyle={{ color: "white" }}
                    color="green"
                    label="Credit"
                    value="credit"
                    position="leading"
                  />
                </View>
              </RadioButton.Group>
            </View>
            <View className={`space-y-2 mt-6 w-full`}>
              <Text className="text-base text-gray-100">Date</Text>
              <View className="w-full h-12 px-2 bg-black-100 rounded-2xl border-2 relative border-black-200 focus:border-secondary flex flex-row items-center">
                <TextInput
                  className="flex-auto flex text-white font-semibold text-base"
                  value={date.toDateString()}
                  onChangeText={(e: any) => setDate(e)}
                  editable={false}
                  onPress={() => {
                    DateTimePickerAndroid.open({
                      value: new Date(),
                      mode: "date",
                      onChange: (_, dat) => dat && setDate(dat),
                    });
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    DateTimePickerAndroid.open({
                      value: new Date(),
                      mode: "date",
                      onChange: (_, dat) => dat && setDate(dat),
                    });
                  }}
                  className="bg-secondary absolute top-0 right-0 rounded-2xl h-11 px-5 flex flex-row justify-center items-center"
                >
                  <Text className="text-primary text-lg font-semibold">
                    Date
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className={`space-y-2 mt-6 w-full`}>
              <Text className="text-base text-gray-100">Category</Text>
              <SelectList
                setSelected={(val: any) => setCategory(val)}
                data={categoryType}
                save="value"
                boxStyles={{ backgroundColor: "#161622" }}
                dropdownItemStyles={{ backgroundColor: "#161622" }}
                dropdownTextStyles={{ color: "white" }}
                dropdownStyles={{ backgroundColor: "black" }}
                inputStyles={{ color: "white" }}
                search={false}
                placeholder="Select Category"
                searchicon={<Icon name="search" size={24} color={"white"} />}
              />
            </View>
            <InputField
              title={"Description"}
              handleChange={(e: any) => setDescription(e)}
              value={description}
              keyboardType="text"
              viewStyle="mt-6 w-full"
            />
            <View className="w-full flex justify-center mt-6">
              <CustomButton
                title="Create Transaction"
                onPress={submitHandler}
                disabled={loading}
              />
            </View>
            <View className="h-32"></View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default New;
