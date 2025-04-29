import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TextField from "@/components/textField";
import { Link, useRouter } from "expo-router";
import { Snackbar } from "react-native-paper";
import CustomButton from "@/components/customButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/components/redux/store";
import * as ImagePicker from "expo-image-picker";
import { changeProfile } from "@/components/redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileUpdate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState<any>();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { users, user } = useSelector((state: any) => state.user);
  const router = useRouter();

  const onDismissSnackBar = async () => {
    setVisible(false);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!name) {
      setVisible(true);
      setLoading(false);
      setTitle("Name is required");
      return;
    }

    if (!email) {
      setVisible(true);
      setLoading(false);
      setTitle("Email is required");
      return;
    }

    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      setVisible(true);
      setLoading(false);
      setTitle("Invalid email address");
      return;
    }

    let form = { ...user, name, email };

    if (image) {
      form = { ...form, image };
    }

    if (user.email !== email) {
      users.forEach((e: any) => {
        if (e.emal === email) {
          setVisible(true);
          setLoading(false);
          setTitle("email id already exists");
        }
      });
    }

    try {
      let ind = await users.map((u: any) => (u.id === user.id ? form : u));
      await AsyncStorage.setItem("user", JSON.stringify(ind));
      dispatch(changeProfile(form));
      setLoading(false);
      setVisible(false);
      router.push("/(tabs)/profile");
    } catch (error: any) {
      setVisible(true);
      setLoading(false);
      setTitle(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      user.image &&
        setImage({ uri: `data:image/jpeg;base64,${user.image.base64}` });
    }
  }, [user]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "We need access to your media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true, // Enable Base64 conversion
      quality: 1,
    });

    if (!result.canceled) {
      const { uri, base64 } = result.assets[0];
      setImage({ uri, base64 });
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView style={{ minHeight: Dimensions.get("screen").height }}>
        <View className="w-full h-full flex px-4 my-6 justify-center items-center">
          <Text className="font-bold text-white text-xl text-center">
            Update Profile
          </Text>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                image ? image.uri : require("../../assets/images/r_logo.jpg")
              }
              style={{
                width: 150,
                height: 150,
                borderRadius: 100,
                padding: 10,
                marginBottom: 10,
                borderColor: "#161622",
                borderWidth: 1,
              }}
            />
          </TouchableOpacity>
          <TextField
            title={"Name"}
            handleChange={(e: any) => setName(e)}
            value={name}
            keyboardType="default"
            viewStyle="mt-6 w-full"
          />
          <TextField
            title={"Email"}
            handleChange={(e: any) => setEmail(e)}
            value={email}
            keyboardType="email-address"
            viewStyle="mt-6 w-full"
            caretHidden={false}
          />
          <View className="w-full flex justify-center mt-6">
            <CustomButton
              disabled={loading}
              title={loading ? "Loading..." : "Update Profile"}
              onPress={handleSubmit}
            />
          </View>

          <Snackbar
            className=""
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
              label: "Undo",
              onPress: () => {
                // Do something
              },
            }}
          >
            {title}
          </Snackbar>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileUpdate;
