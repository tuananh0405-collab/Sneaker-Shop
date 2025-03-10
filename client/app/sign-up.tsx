import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useSignUpMutation, useVerifyEmailMutation } from "@/redux/api/authApiSlice";
import { useRouter } from "expo-router";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");  // State for verification code
  const [showVerify, setShowVerify] = useState(false); // State to show/hide the verification input
  const router = useRouter();

  // API call for signing up
  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();

  const handleSignUp = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await signUp({name, email, password, phone }).unwrap();
      Alert.alert("Success", response.message, [
        { text: "OK", onPress: () => setShowVerify(true) },  // Show the verification code input after successful sign-up
      ]);
    } catch (err) {
      Alert.alert("Sign Up Failed", err?.data?.message || "Something went wrong.");
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }

    try {
      const response = await verifyEmail({ email, verificationCode, password }).unwrap();
     
       router.push("/sign-in")  // Redirect to sign-in after successful email verification
      
    } catch (err) {
      Alert.alert("Verification Failed", err?.data?.message || "Verification failed. Please try again.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 20 }}>Sign Up</Text>

      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 }}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 }}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 }}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity onPress={handleSignUp} style={{ backgroundColor: "#4CAF50", padding: 15, marginTop: 10 }}>
        {isSigningUp ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center" }}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Verify Email Section */}
     
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 10 }}>Verify Your Email</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 }}
            placeholder="Enter Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <TouchableOpacity onPress={handleVerify} style={{ backgroundColor: "#4CAF50", padding: 15 }}>
            {isVerifying ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", textAlign: "center" }}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      
    </View>
  );
};

export default SignUp;
