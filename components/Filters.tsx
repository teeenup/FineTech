import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RadioButton } from "react-native-paper";
import { SelectList } from "react-native-dropdown-select-list";
import { useSelector } from "react-redux";

interface filt {
  date: string;
  type: string;
  category: string;
  count: string;
  sort: string;
}

interface filterProps {
  onClose: () => void;
  onClick: () => void;
  filters: filt;
  setFilters: Dispatch<SetStateAction<filt>>;
}

const Filters = ({ onClose, onClick, filters, setFilters }: filterProps) => {
  const [categoryType, setCategoryType] = useState<string[]>([]);

  const { categories } = useSelector((state: any) => state.transaction);

  function resetFilter() {
    setFilters({
      date: "all",
      count: "all",
      category: "all",
      type: "all",
      sort: "asending",
    });
    onClick();
  }

  useEffect(() => {
    if (filters.type !== "all") {
      setCategoryType([
        "all",
        ...categories
          .filter(
            (cat: any) =>
              cat.type === (filters.type === "credit" ? "income" : "expense")
          )
          .map((cat: any) => cat.name),
      ]);
    }
  }, [filters.type]);

  return (
    <View className="overflow-y-auto max-h-[75vh]">
      {/* heading of filters */}
      <View
        style={{ position: "sticky", top: 0, left: 0 }}
        className="py-3 sticky bg-primary z-10 top-0 left-0 w-full px-2"
      >
        <Text className="font-bold text-white text-lg text-center">
          Filters
        </Text>
        <TouchableOpacity className="absolute right-3 top-2" onPress={onClose}>
          <Icon name={"close"} size={28} className="text-gray-400" />
        </TouchableOpacity>
      </View>

      {/* main content of filters */}
      <ScrollView>
        <View className="min-h-20 w-full px-2 py-4">
          <View className="flex flex-row flex-wrap gap-4 justify-evenly w-full items-center py-4">
            <Text className="text-gray-100 text-base font-semibold w-full">
              Sort By
            </Text>
            {[
              { label: "Asending Order", value: "asending" },
              { label: "Desending Order", value: "desending" },
              { label: "Biggest Amount", value: "big" },
              { label: "Smallest Amount", value: "small" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => setFilters({ ...filters, sort: item.value })}
                className={`p-2 rounded-lg ${
                  filters.sort === item.value ? "bg-secondary" : "bg-primary"
                } border border-[#161690] border-solid shadow-gray-100`}
              >
                <Text className="text-white opacity-90">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex flex-row flex-wrap gap-4 justify-evenly w-full items-center py-4">
            <Text className="text-gray-100 text-base font-semibold w-full">
              Days
            </Text>
            {[
              { label: "All", value: "all" },
              { label: "Week", value: "thisWeek" },
              { label: "Month", value: "thisMonth" },
              { label: "Year", value: "thisYear" },
              { label: "Last Week", value: "week" },
              { label: "Last Month", value: "month" },
              { label: "Last Year", value: "year" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => setFilters({ ...filters, date: item.value })}
                className={`p-2 rounded-lg ${
                  filters.date === item.value ? "bg-secondary" : "bg-primary"
                } border border-[#161690] border-solid shadow-gray-100`}
              >
                <Text className="text-white opacity-90">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className={`space-y-2 mt-6 w-full`}>
            <Text className="text-base text-gray-100">Type</Text>
            <RadioButton.Group
              onValueChange={(newValue) =>
                setFilters({ ...filters, type: newValue })
              }
              value={filters.type}
            >
              <View className="flex flex-row items-center justify-between">
                <RadioButton.Item
                  labelStyle={{ color: "white" }}
                  label="All"
                  value="all"
                  position="leading"
                  color="white"
                />
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
          {filters.type !== "all" && (
            <View className={`space-y-2 mt-6 w-full`}>
              <Text className="text-base text-gray-100">Category</Text>
              <SelectList
                setSelected={(val: any) =>
                  setFilters({ ...filters, category: val })
                }
                data={categoryType}
                save="value"
                defaultOption={{
                  key: filters.category,
                  value: filters.category,
                }}
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
          )}

          <View className="flex flex-row mt-6 flex-wrap gap-4 justify-evenly w-full items-center py-4">
            <Text className="text-gray-100 text-base font-semibold w-full">
              Transaction count
            </Text>
            {[
              { label: "All", value: "all" },
              { label: "15", value: "15" },
              { label: "50", value: "50" },
              { label: "100", value: "100" },
              { label: "Custom", value: "custom" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => setFilters({ ...filters, count: item.value })}
                className={`p-2 rounded-lg ${
                  filters.count === item.value ? "bg-secondary" : "bg-primary"
                } border border-[#161690] border-solid shadow-gray-100`}
              >
                <Text className="text-white opacity-90">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {filters.count === "custom" && (
            <View className={"space-y-2 mt-6 w-full"}>
              <Text className="text-base text-white">Count</Text>
              <View className="w-full h-10 px-4 rounded-xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
                <TextInput
                  className="flex-auto flex text-white font-semibold text-base"
                  value={filters.count}
                  onChangeText={(e) => setFilters({ ...filters, count: e })}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* action area of filters */}
      <View
        style={{ position: "sticky", bottom: 0, left: 0 }}
        className="flex-row z-20 bg-primary sticky bottom-0 left-0 w-full justify-between gap-2 px-2 py-4"
      >
        <TouchableOpacity
          className="bg-secondary-100 p-2 min-w-16 rounded-lg"
          onPress={onClick}
        >
          <Text className="color-white text-center uppercase font-semibold">
            Apply
          </Text>
        </TouchableOpacity>
        <View className="gap-3 flex-row">
          <TouchableOpacity
            className="bg-secondary-100 p-2 min-w-16 rounded-lg"
            onPress={resetFilter}
          >
            <Text className="color-white text-center uppercase font-semibold">
              Reset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border border-[#49496c] p-2 min-w-16 rounded-lg"
            onPress={onClick}
          >
            <Text className="color-white text-center uppercase font-semibold">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Filters;
