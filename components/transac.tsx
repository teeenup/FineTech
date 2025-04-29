import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { allTransactions, Transaction } from "./redux/slices/transSlice";
import Slide from "./Slide";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputField from "./inputField";
import { RadioButton } from "react-native-paper";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { SelectList } from "react-native-dropdown-select-list";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Transac = ({ item }: { item: Transaction }) => {
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [deleteT, setDeleteT] = useState(false);
  const [categoryType, setCategoryType] = useState<string[]>([]);

  const [name, setName] = useState(item.name);
  const [type, setType] = useState(item.type);
  const [amount, setAmount] = useState(item.amount);
  const [date, setDate] = useState<Date>(new Date(item.date));
  const [category, setCategory] = useState(item.category);
  const [description, setDescription] = useState(item.description);

  const { categories, transactions } = useSelector(
    (state: any) => state.transaction
  );
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  function openSelect() {
    setOpen(true);
  }

  const updateTransaction = async () => {
    let tempTransactions = transactions.map((transaction: Transaction) => {
      if (transaction.id === item.id) {
        return {
          ...transaction,
          name,
          type,
          date,
          category,
          amount: Number(amount),
          description,
        };
      }
      return transaction;
    });
    await AsyncStorage.setItem(
      `categories[${user.id}]`,
      JSON.stringify(tempTransactions)
    );
    setUpdate(false);
    dispatch(allTransactions(tempTransactions));
  };

  const deleteTransaction = async () => {
    let tempTransactions = transactions.filter(
      (transaction: Transaction) => transaction.id !== item.id
    );

    await AsyncStorage.setItem(
      `transaction[${user.id}]`,
      JSON.stringify(tempTransactions)
    );
    setDeleteT(false);
    dispatch(allTransactions(tempTransactions));
  };

  function Info() {
    return (
      <View className="flex-col">
        <Text className="font-semibold color-white text-base">
          Id : <Text className="text-base pl-2 font-normal">{item.id}</Text>
        </Text>
        <Text className="font-semibold color-white text-base">
          Name : <Text className="text-base pl-2 font-normal">{item.name}</Text>
        </Text>
        <Text className="font-semibold color-white text-base">
          Amount :{" "}
          <Text className="text-base pl-2 font-normal">{item.amount}</Text>
        </Text>
        <Text className="font-semibold color-white text-base">
          Type : <Text className="text-base pl-2 font-normal">{item.type}</Text>
        </Text>
        <Text className="font-semibold color-white text-base">
          Description :{" "}
          <Text className="text-base pl-2 font-normal">{item.description}</Text>
        </Text>
      </View>
    );
  }

  useEffect(() => {
    if (type !== "all") {
      setCategoryType([
        ...categories
          .filter(
            (cat: any) =>
              cat.type === (type === "credit" ? "income" : "expense")
          )
          .map((cat: any) => cat.name),
        "Others",
      ]);
    }
  }, [type]);

  return (
    <>
      <TouchableOpacity
        onLongPress={openSelect}
        className="flex w-full max-w-full bg-black-200 rounded-lg p-3 justify-between items-center flex-row gap-4"
      >
        <View className="flex justify-between items-start gap-2">
          <Text className="text-white font-bold text-lg">{item.name}</Text>
          {/* {item.description && (
            <Text className="text-white">
              {item.description.slice(0, 28)}
              {item.description.length > 28 ? "..." : ""}
            </Text>
          )} */}
          <Text className="text-white bg-blue-500 rounded-lg px-1 text-base">
            {item.category}
          </Text>
        </View>
        <View className="flex justify-between items-end flex-col gap-2">
          <Text
            className={`${
              item.type === "debit" ? "text-red-500" : "text-green-500"
            } font-extrabold text-2xl`}
          >
            {item.type === "debit" ? "-" : "+"} ₹{item.amount}
          </Text>
          <Text className="text-white font-light text-sm">
            {new Date(item.date).toDateString()}
          </Text>
        </View>
      </TouchableOpacity>
      {open && (
        <Slide open={open} onClose={() => setOpen(false)}>
          <View className="overflow-y-auto max-h-[75vh]">
            <View className="py-3 sticky bg-primary z-10 top-0 left-0 w-full px-2">
              <Text className="font-bold text-white text-lg text-center">
                Transaction
              </Text>
              <TouchableOpacity
                className="absolute right-3 top-2"
                onPress={() => setOpen(false)}
              >
                <Icon name={"close"} size={28} className="text-gray-400" />
              </TouchableOpacity>
            </View>
            <View className="min-h-20 w-full px-2 py-4">
              <Info />
            </View>
            <View className="flex-row z-20 bg-primary sticky bottom-0 left-0 w-full justify-between gap-2 px-2 py-4">
              <TouchableOpacity
                className="bg-red-500 p-2 min-w-16 rounded-lg"
                onPress={() => setDeleteT(true)}
              >
                <Text className="color-white text-center uppercase font-semibold">
                  Delete
                </Text>
              </TouchableOpacity>
              <View className="gap-3 flex-row">
                <TouchableOpacity
                  className="bg-secondary-200 p-2 min-w-16 rounded-lg"
                  onPress={() => setUpdate(true)}
                >
                  <Text className="color-white text-center uppercase font-semibold">
                    Update
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="border border-[#49496c] p-2 min-w-16 rounded-lg"
                  onPress={() => setOpen(false)}
                >
                  <Text className="color-white text-center uppercase font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Slide>
      )}
      {update && (
        <Slide
          popupStyle={{ overflowY: "auto" }}
          open={update}
          onClose={() => setUpdate(false)}
        >
          {/* <ScrollView
          style={{
            height: 0.5 * window.innerHeight,
            maxHeight: 0.5 * window.innerHeight,
          }}
        > */}
          <View className="overflow-y-auto max-h-[75vh]">
            <View className="py-3 sticky bg-primary z-10 top-0 left-0 w-full px-2">
              <Text className="font-bold text-white text-lg text-center">
                Update Transaction
              </Text>
              <TouchableOpacity
                className="absolute right-3 top-2"
                onPress={() => setUpdate(false)}
              >
                <Icon name={"close"} size={28} className="text-gray-400" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View className="min-h-20 w-full px-2 py-2">
                <View className="px-4 pb-10">
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
                    value={amount + ""}
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
                      defaultOption={{ key: category, value: category }}
                      boxStyles={{ backgroundColor: "#161622" }}
                      dropdownItemStyles={{ backgroundColor: "#161622" }}
                      dropdownTextStyles={{ color: "white" }}
                      dropdownStyles={{ backgroundColor: "black" }}
                      inputStyles={{ color: "white" }}
                      search={false}
                      placeholder="Select Category"
                      searchicon={
                        <Icon name="search" size={24} color={"white"} />
                      }
                    />
                  </View>
                  <InputField
                    title={"Description"}
                    handleChange={(e: any) => setDescription(e)}
                    value={description}
                    keyboardType="text"
                    viewStyle="mt-6 w-full"
                  />
                </View>
              </View>
            </ScrollView>
            <View className="flex-row z-20 bg-primary sticky bottom-0 left-0 w-full justify-between gap-2 px-2 py-4">
              <TouchableOpacity
                className="bg-secondary-200 p-2 min-w-16 rounded-lg"
                onPress={updateTransaction}
              >
                <Text className="color-white text-center uppercase font-semibold">
                  Update
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-[#49496c] p-2 min-w-16 rounded-lg"
                onPress={() => setUpdate(false)}
              >
                <Text className="color-white text-center uppercase font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Slide>
      )}
      {deleteT && (
        <Slide open={deleteT} onClose={() => setDeleteT(false)}>
          <View className="max-h-[80vh]">
            <View className="py-3 sticky bg-primary z-10 top-0 left-0 w-full px-2">
              <Text className="font-bold text-white text-lg text-center">
                Delete Transaction
              </Text>
              <TouchableOpacity
                className="absolute right-3 top-2"
                onPress={() => setDeleteT(false)}
              >
                <Icon name={"close"} size={28} className="text-gray-400" />
              </TouchableOpacity>
            </View>
            <View className="min-h-20 w-full px-2 py-4">
              <Info />
              <Text className="w-full color-white mt-6">
                <Text className="font-bold">{item.id}</Text>'s Delete this
                transaction
              </Text>
            </View>
            <View className="flex-row z-20 bg-primary sticky bottom-0 left-0 w-full justify-between gap-2 px-2 py-4">
              <TouchableOpacity
                className="bg-red-500 p-2 min-w-16 rounded-lg"
                onPress={deleteTransaction}
              >
                <Text className="color-white text-center uppercase font-semibold">
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-[#49496c] p-2 min-w-16 rounded-lg"
                onPress={() => setDeleteT(false)}
              >
                <Text className="color-white text-center uppercase font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Slide>
      )}
    </>
  );
};

export default Transac;
