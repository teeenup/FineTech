import { View, Text, TextInput } from "react-native";
import React from "react";

const InputField = ({
  title,
  type,
  value,
  handleChange,
  viewStyle,
  inputStyle,
  ...props
}: any) => {
  return (
    <View className={`space-y-2 ${viewStyle}`}>
      <Text className="text-base text-gray-100">{title}</Text>
      <View className="w-full h-12 px-2 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-auto flex text-white font-semibold text-base"
          value={value}
          onChangeText={handleChange}
          {...props}
        />
      </View>
    </View>
  );
};

export default InputField;
