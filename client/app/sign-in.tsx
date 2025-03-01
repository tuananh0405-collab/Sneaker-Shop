import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Pressable,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { Redirect, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { loginWithEmail } from "@/redux/features/authSlice";
import { AppDispatch, RootState } from "@/redux/store";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      const result = await dispatch(
        loginWithEmail({ email, password })
      ).unwrap();
      router.navigate("/");
      if (result?.token) {
        Alert.alert("Success", "Logged in successfully!");
      }
    } catch (err) {
      Alert.alert("Login Failed");
    }
  };

  const handleLogin = () => {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="bg-white h-full">
        <ScrollView contentContainerClassName="h-full">
          <Image
            source={images.larmbo}
            className="w-full h-3/6"
            resizeMode="contain"
          />
          <View className="px-10">
            <Text className="text-base font-rubik text-center uppercase text-black-200">
              Welcome to MMA
            </Text>
            <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
              Let's Get You Closer to {"\n"}
              <Text className="text-primary-300">Your Ideal Cars</Text>
            </Text>

            {/* Email Login Form */}
            <View className="mt-6">
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mt-2  "
                placeholder="Email"
                placeholderTextColor="gray"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mt-2"
                placeholderTextColor="gray"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={handleEmailLogin}
                className="bg-primary-300 rounded-md py-3 mt-4"
              >
                <Text className="text-center text-white font-rubik-medium">
                  Log In
                </Text>
              </TouchableOpacity>
            </View>

            <View className={"flex-row items-center my-6"}>
              <View className={"flex-1 border-b border-gray-400"} />
              <Text className={"mx-4 text-lg text-gray-600 font-rubik"}>
                Or Continue with
              </Text>
              <View className={"flex-1 border-b border-gray-400"} />
            </View>
            <View className="flex flex-row justify-center mt-2">
              <TouchableOpacity
                onPress={handleLogin}
                className="bg-white shadow-md shadow-zinc-300 rounded-full w-1/2 py-4 mx-2 flex-row items-center justify-center"
              >
                <Image
                  source={icons.google}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                  Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogin}
                className="bg-white shadow-md shadow-zinc-300 rounded-full w-1/2 py-4 mx-2 flex-row items-center justify-center"
              >
                <Image
                  source={icons.facebook}
                  className="w-9 h-9"
                  resizeMode="contain"
                />
                <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                  Facebook
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
