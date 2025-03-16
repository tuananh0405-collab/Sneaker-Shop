import { View, Text, TouchableOpacity, Image, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import images from "@/constants/images";
import { useAddToWishListMutation } from "@/redux/api/wishlistApiSlice";
import { Product } from "@/interface";
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  item: Product;
  onPress?: () => void;
  onAddToWishlist: (item: Product) => void; // Callback to update the wishlist in parent component
}

export const FeaturedCard = ({ item, onPress, onAddToWishlist }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToWishList = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      // Simulate adding to wishlist (You can replace this with actual API logic)
      if (email) {
        setMessage("Product added to wishlist!");
        setModalVisible(true);
        onAddToWishlist(item); // Call the parent function to update the wishlist
      }
    } catch (error) {
      setMessage("Error adding product to wishlist!");
      setModalVisible(true);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} className="flex flex-col items-start w-60 h-80 relative">
      <Image source={{ uri: item.images[0] }} className="size-full rounded-2xl" />
      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <FontAwesome name="star" size={14} color="#FFCE00" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-1">5</Text>
      </View>

      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <Text className="text-xl font-rubik-extrabold text-white" numberOfLines={1}>{item.name}</Text>
        <Text className="text-base font-rubik text-white" numberOfLines={1}>{item.collections}</Text>

        <View className="flex flex-row items-center justify-between w-full">
          <Text className="text-xl font-rubik-extrabold text-white">${item?.variants[0]?.price}</Text>
          <TouchableOpacity onPress={handleAddToWishList}>
            <FontAwesome name="heart" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for success/error message */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View
            style={{
              backgroundColor: "white",
              padding: 30,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              width: 300,
            }}
          >
            <Text style={{ color: message.includes("Error") ? "red" : "green", fontSize: 18 }}>{message}</Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 20,
                borderRadius: 25,
                padding: 10,
              }}
            >
              <FontAwesome name="times" size={24} color="#000" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export const Card = ({ item, onPress }: Props) => {
  const [addToWishList, { isLoading, isError }] = useAddToWishListMutation();
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [message, setMessage] = useState(""); // State for message inside the modal

  const handleAddToWishList = async () => {
    try {
      const email=await AsyncStorage.getItem("userEmail");
      const response = await addToWishList({ productId: item._id,email:email }).unwrap();
      if (response.success) {
        setMessage("Added to wishlist!"); // Success message
        setModalVisible(true); // Show modal
      }
    } catch (error) {
      setMessage("This product is already in your wishlist!"); // Error message
      setModalVisible(true); // Show modal
    }
  };

  return (
    <TouchableOpacity
      className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
      onPress={onPress}
    >
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <FontAwesome name="star" size={14} color="#FFCE00" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">5</Text>
      </View>

      <Image source={{ uri: item?.images[0] }} className="w-full h-40 rounded-lg" />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">{item.name}</Text>
        <Text className="text-xs font-rubik text-black-100">{item.collections}</Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-base font-rubik-bold text-primary-300">${item?.variants[0]?.price}</Text>
          <TouchableOpacity
            onPress={handleAddToWishList}
          >
            <FontAwesome name="heart" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for success/error message */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View
            style={{
              backgroundColor: "white",
              padding: 30, // Increased padding for a larger popup
              borderRadius: 15, // Adjusted border radius
              alignItems: "center",
              justifyContent: "center",
              width: 300, // Increased width for a larger popup
            }}
          >
            <Text style={{ color: message.includes("already") ? "red" : "green", fontSize: 18 }}>
              {message}
            </Text>
            {/* Close button styled as a button */}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 20,
                backgroundColor: "#DDDDDD", // Light background color for the button
                borderRadius: 25, // Rounded corners for the button
                padding: 10, // Adequate padding for the button
              }}
            >
              <FontAwesome name="times" size={24} color="#000" /> {/* Font Awesome "X" icon */}
            </Pressable>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};
