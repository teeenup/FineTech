import { View, Text, TextInput, TextInputProps } from "react-native";
import React from "react";

interface TextFieldProps extends TextInputProps {
  title: string;
  type?: string;
  value: string;
  handleChange: (text: string) => void;
  viewStyle?: string;
  inputStyle?: string;
}

const TextField: React.FC<TextFieldProps | TextFieldProps> = ({
  title,
  type,
  value,
  handleChange,
  viewStyle,
  inputStyle,
  ...props
}) => {
  return (
    <View className={`space-y-2 ${viewStyle}`}>
      <Text className="text-base text-gray-100">{title}</Text>
      <View className="w-full  h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
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

export default TextField;
