import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-secondary rounded-xl min-h-[62px] py-3 px-5 flex flex-row justify-center items-center"
      {...props}
    >
      <Text className="text-primary text-lg font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
