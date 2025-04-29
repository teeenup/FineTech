import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Transaction } from "./redux/slices/transSlice";
import { PieChart } from "react-native-gifted-charts";

interface typess {
  typeData: Transaction[];
  renderLegend: Function;
}

const CategoryChart = ({ typeData, renderLegend }: typess) => {
  const [type, setType] = useState("all");
  const [data, setData] = useState<any>([]);

  const colorArray = [
    "#2196f3",
    "#f44336",
    "rgb(84,219,234)",
    "lightgreen",
    "orange",
  ];

  const categoryData = (typeD: string) => {
    let datalist: any = [];
    let cat: any = [];
    let tempData;
    if (type !== "all") {
      tempData = typeData.filter((d: Transaction) => d.type === typeD);
    } else {
      tempData = typeData;
    }
    tempData.map((d: Transaction) => {
      let i = cat.indexOf(d.category);
      if (i !== -1) {
        let label = datalist[i];
        datalist[i] = { ...label, value: label.value + d.amount };
      } else {
        cat.push(d.category);
        datalist.push({
          label: d.category,
          value: d.amount,
          color: colorArray[cat.length - 1],
        });
      }
      return;
    });
    setData(datalist);
  };

  useEffect(() => {
    if (!typeData) {
      setData([]);
      return;
    }
    if (typeData.length <= 0) {
      setData([]);
      return;
    }
    if (type === "income") {
      categoryData("credit");
    } else {
      categoryData("debit");
    }
  }, [type, typeData, setData]);

  return (
    <View>
      {typeData.length > 0 && (
        <View className="flex items-center">
          <View className="flex flex-row flex-wrap gap-4 justify-evenly w-full items-center py-4">
            <Text className="text-white w-full text-center mt-6 mb-3 font-bold text-lg">
              Categories
            </Text>

            {[
              { label: "All", value: "all" },
              { label: "Income", value: "income" },
              { label: "Expense", value: "expense" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => setType(item.value)}
                className={`p-2 rounded-lg ${
                  type === item.value ? "bg-secondary" : "bg-primary"
                } border border-[#161690] border-solid shadow-gray-100`}
              >
                <Text className="text-white opacity-90">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {data.length > 0 && (
            <>
              <PieChart
                data={data}
                showTooltip={true}
                tooltipBackgroundColor={"white"}
                tooltipComponent={() => (
                  <View className="bg-white w-5 h-3">
                    <Text>hello</Text>
                  </View>
                )}
              />
              <View className="mt-5 justify-evenly gap-1 flex-row w-full flex-wrap">
                {data.map((d: any, i: number) =>
                  renderLegend(d.label, colorArray[i])
                )}
              </View>
            </>
          )}
          {data.length <= 0 && (
            <View className="min-h-60 justify-center mb-8 items-center">
              <Text className="opacity-80 font-bold color-gray-400">
                There is no {type} transactions
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default CategoryChart;
