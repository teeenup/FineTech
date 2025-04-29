import {
  Modal,
  ModalBaseProps,
  Pressable,
  ScrollView,
  ViewStyle,
} from "react-native";
import React from "react";
import { View } from "react-native";

interface SlideProps extends ModalBaseProps {
  open?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  popupStyle?: ViewStyle;
}

const Slide = ({ open, onClose, children, popupStyle }: SlideProps) => {
  return (
    <Modal
      className="overflow-y-auto"
      transparent
      animationType="fade"
      visible={open}
      onDismiss={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-[#1e1e2daa] justify-center items-center"
      >
        <Pressable
          style={popupStyle}
          className="bg-primary overflow-y-auto gap-1 min-w-80 rounded-lg w-80"
        >
          <ScrollView className="bg-primary w-80 gap-1 rounded-lg min-w-80">
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default Slide;
