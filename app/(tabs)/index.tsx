import { Transaction } from "@/components/redux/slices/transSlice";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { useSelector } from "react-redux";
import moment, { weekdays } from "moment";
import CategoryChart from "@/components/categoryChart";
import { router } from "expo-router";

interface weekDaysInter {
  label: string;
  value: number;
}

const TransactionGraphScreen = () => {
  const [typeDate, setTypeDate] = React.useState("all");
  const [typeData, setTypeData] = React.useState<Transaction[]>([]);
  const [weeklyData, setWeeklyData] = React.useState<weekDaysInter[]>([]);
  const [monthData, setMonthData] = React.useState<any>();
  const [month, setMonth] = React.useState<boolean>(new Date().getMonth() < 6);

  const { transactions } = useSelector((state: any) => state.transaction);

  const renderLegend = (text: string, color: string) => {
    return (
      <View key={text} className="justify-center items-center flex-row mb-3">
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 3,
            borderRadius: 4,
            backgroundColor: color || "white",
          }}
        />
        <Text style={{ color: "white", fontSize: 16 }}>{text || ""}</Text>
      </View>
    );
  };
  // Mock data for graphs

  const filterByDate = (type: any, days: number, endWith: any) =>
    transactions.filter((t: any) => {
      const oneWeekAgo = moment().subtract(days, type).startOf(endWith);
      const today = moment().subtract(days, type).endOf(endWith);

      return moment(new Date(Date.parse(t.date))).isBetween(oneWeekAgo, today);
    });

  useEffect(() => {
    if (typeDate === "week") {
      setTypeData(filterByDate("days", 7, "week"));
    } else if (typeDate === "month") {
      setTypeData(filterByDate("month", 1, "month"));
    } else if (typeDate === "thisMonth") {
      setTypeData(filterByDate("days", 0, "month"));
    } else if (typeDate === "thisWeek") {
      setTypeData(filterByDate("days", 0, "week"));
    } else if (typeDate === "thisYear") {
      setTypeData(filterByDate("days", 0, "year"));
    } else if (typeDate === "year") {
      setTypeData(filterByDate("month", 12, "year"));
    } else {
      setTypeData(transactions);
    }
  }, [typeDate, transactions, setTypeData]);

  useEffect(() => {
    let weeklyTransactions = [
      { label: "Sun", value: 0 },
      { label: "Mon", value: 0 },
      { label: "Tue", value: 0 },
      { label: "Wed", value: 0 },
      { label: "Thu", value: 0 },
      { label: "Fri", value: 0 },
      { label: "Sat", value: 0 },
    ];
    if (!typeData) {
      setWeeklyData(weeklyTransactions);
      return;
    }
    if (typeData.length <= 0) {
      setWeeklyData(weeklyTransactions);
      return;
    }

    typeData.map((transaction: Transaction) => {
      let i = new Date(transaction.date).getDay();
      let item = weeklyTransactions[i];

      weeklyTransactions[i] = {
        ...item,
        value: item.value + Number(transaction.amount),
      };
    });
    setWeeklyData(weeklyTransactions);
    return () => {};
  }, [typeDate, transactions, typeData]);

  useEffect(() => {
    // setWeeklyData(weeklyTransactions.map((v: {label: string, value: number}) => ({...v, value: 0})))
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let expense = { frontColor: "#3BE9DE", gradientColor: "#93FCF8", value: 0 };
    let income = {
      frontColor: "#006DFF",
      gradientColor: "#009FFF",
      spacing: 6,
      value: 0,
    };

    let tempData: any = [];
    months.map((month: string) => {
      tempData.push({ ...income, label: month });
      tempData.push({ ...expense });
    });
    if (!typeData) {
      setMonthData(tempData);
      return;
    }
    if (typeData.length <= 0) {
      setMonthData(tempData);
      return;
    }

    typeData.map((transaction: Transaction) => {
      let add = transaction.type === "credit" ? 0 : 1;
      let i = new Date(transaction.date).getMonth() * 2 + add;
      let item = tempData[i];

      tempData[i] = {
        ...item,
        value: item.value + transaction.amount,
      };
    });
    setMonthData(tempData);
    return () => {};
  }, [typeDate, transactions, typeData]);

  return (
    <ScrollView>
      {transactions.length > 0 ? (
        <View
          style={styles.container}
          className="flex justify-center bg-primary items-center px-3 min-h-screen flex-col gap-2"
        >
          <View className="flex flex-row flex-wrap gap-4 justify-evenly w-full items-center py-4">
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
                onPress={() => setTypeDate(item.value)}
                className={`p-2 rounded-lg ${
                  typeDate === item.value ? "bg-secondary" : "bg-primary"
                } border border-[#161690] border-solid shadow-gray-100`}
              >
                <Text className="text-white opacity-90">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View>
            <CategoryChart typeData={typeData} renderLegend={renderLegend} />
          </View>
          {typeData.length > 0 && (
            <>
              <Text className="text-white mt-16 font-bold text-lg">
                Weekly Transactions
              </Text>
              <View className="pr-6">
                <BarChart
                  horizontal
                  data={weeklyData}
                  barWidth={20}
                  barBorderRadius={4}
                  frontColor="#3F51B5"
                  height={300}
                  width={280}
                  noOfSections={5}
                  yAxisTextStyle={{ color: "#efefef" }}
                  xAxisLabelTextStyle={{ color: "#efefef", paddingRight: 10 }}
                  xAxisThickness={0}
                  yAxisThickness={0}
                  isAnimated
                  renderTooltip={(value: any) => (
                    <View className="bg-white p-2 rounded-lg">
                      <Text className="text-black">{value.value}</Text>
                    </View>
                  )}
                  color={"red"}
                />
              </View>

              <View className="flex flex-row flex-wrap gap-4 justify-evenly w-full items-center py-4">
                <Text
                  style={{
                    color: "white",
                    marginTop: 140,
                    fontWeight: "bold",
                  }}
                  className="text-lg w-full text-center"
                >
                  Monthly Transaction
                </Text>
                {[
                  { label: "Jan - Jun", value: true },
                  { label: "July - Dec", value: false },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={() => setMonth(item.value)}
                    className={`p-2 rounded-lg ${
                      month === item.value ? "bg-secondary" : "bg-primary"
                    } border border-[#161690] border-solid shadow-gray-100`}
                  >
                    <Text className="text-white opacity-90">{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ padding: 20, alignItems: "center" }}>
                {monthData && (
                  <BarChart
                    data={month ? monthData.slice(0, 12) : monthData.slice(12)}
                    barWidth={16}
                    initialSpacing={10}
                    spacing={14}
                    barBorderRadius={4}
                    yAxisThickness={0}
                    xAxisType={"dashed"}
                    xAxisColor={"lightgray"}
                    yAxisTextStyle={{ color: "lightgray" }}
                    stepValue={1000}
                    maxValue={6000}
                    noOfSections={6}
                    yAxisLabelTexts={["0", "1k", "2k", "3k", "4k", "5k", "6k"]}
                    labelWidth={40}
                    xAxisLabelTextStyle={{
                      color: "lightgray",
                      textAlign: "center",
                    }}
                    showLine
                    lineConfig={{
                      color: "#F29C6E",
                      thickness: 3,
                      curved: true,
                      hideDataPoints: true,
                      shiftY: 20,
                      initialSpacing: -30,
                    }}
                  />
                )}
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginTop: 20,
                  }}
                >
                  {renderLegend("Income", "#006DFF")}
                  {renderLegend("Expense", "#3BE9DE")}
                </View>
              </View>
            </>
          )}

          {typeData.length > 0 && (
            <View className="py-14 w-full">
              <View className="flex flex-col gap-2 items-center justify-center">
                <Text className="font-bold text-white pb-3 text-lg">
                  Transaction type
                </Text>
                <PieChart
                  data={[
                    {
                      value:
                        typeData.length === 0
                          ? 0
                          : typeData
                              ?.filter((t: any) => t.type === "credit")
                              ?.reduce(
                                (acc: any, i: any) => acc + i.amount,
                                0
                              ) || 0,
                      color: "#2196F3",
                    },
                    {
                      value:
                        typeData.length === 0
                          ? 0
                          : typeData
                              ?.filter((t: any) => t.type === "debit")
                              ?.reduce(
                                (acc: any, i: any) => acc + i.amount,
                                0
                              ) || 0,
                      color: "#F44336",
                    },
                  ]}
                  // donut
                  radius={100}
                  innerRadius={50}
                  // centerLabelComponent={() => (
                  //   <Text style={styles.centerLabel}>
                  //     {categoryExpenses.reduce((a, b) => a + b.value, 0)}{" "}
                  //   </Text>
                  // )}
                />
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginTop: 20,
                  }}
                >
                  {renderLegend("Income", "#2196f3")}
                  {renderLegend("Expense", "#f44336")}
                </View>
              </View>
            </View>
          )}
          {typeData.length <= 0 && (
            <View
              style={{ minHeight: Dimensions.get("screen").height - 230 }}
              className="flex-1 justify-center bg-primary items-center mb-[-90px] px-3 flex-col gap-4"
            >
              <Text className="color-gray-300 pb-20 text-center w-full font-semibold text-xl">
                There haven't any transaction
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View
          style={{ minHeight: Dimensions.get("screen").height - 140, flex: 1 }}
          className="flex-1 flex justify-center bg-primary items-center px-3 flex-col gap-4 min-h-screen"
        >
          <Text className="color-gray-300 text-center w-full font-semibold text-xl">
            There haven't any transaction
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/new")}
            className="bg-secondary rounded-xl min-h-[30px] py-2 px-3 flex flex-row justify-center items-center"
          >
            <Text className="text-primary text-lg font-semibold">
              Add Transaction
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centerLabel: {
    fontSize: 18,
    color: "black",
  },
  container: {
    flex: 1,
  },
  text: {
    color: "white",
  },
});

export default TransactionGraphScreen;
