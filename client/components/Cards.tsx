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
  const [addToWishList, { isLoading }] = useAddToWishListMutation();
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToWishList = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) {
        setMessage("No user email found!");
        setModalVisible(true);
        return;
      }

      await addToWishList({
        productId: item._id,
        email: email,
        onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
          try {
            const { data } = await queryFulfilled;
            if (data.success) {
              // Update the getWishlist cache
              dispatch(
                useGetWishlistQuery.util.updateQueryData("getWishlist", email, (draft) => {
                  // Ensure draft.data.wishList exists
                  if (!draft.data.wishList) {
                    draft.data.wishList = [];
                  }
                  draft.data.wishList.push({
                    id: item._id,
                    productName: item.name,
                    image: item.images[0],
                    // Add other fields if returned by your API
                  });
                })
              );
              setMessage("Added to wishlist!");
              setModalVisible(true);
            }
          } catch (error) {
            setMessage("This product is already in your wishlist!");
            setModalVisible(true);
          }
        },
      }).unwrap();
    } catch (error) {
      setMessage("This product is already in your wishlist!");
      setModalVisible(true);
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
          <TouchableOpacity onPress={handleAddToWishList} disabled={isLoading}>
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
            <Text style={{ color: message.includes("already") || message.includes("Error") ? "red" : "green", fontSize: 18 }}>
              {message}
            </Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 20,
                backgroundColor: "#DDDDDD",
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
  const [addToWishList, { isLoading }] = useAddToWishListMutation();
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToWishList = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) {
        setMessage("No user email found!");
        setModalVisible(true);
        return;
      }

      await addToWishList({
        productId: item._id,
        email: email,
        onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
          try {
            const { data } = await queryFulfilled;
            if (data.success) {
              // Update the getWishlist cache
              dispatch(
                useGetWishlistQuery.util.updateQueryData("getWishlist", email, (draft) => {
                  // Ensure draft.data.wishList exists
                  if (!draft.data.wishList) {
                    draft.data.wishList = [];
                  }
                  draft.data.wishList.push({
                    id: item._id,
                    productName: item.name,
                    image: item.images[0],
                    // Add other fields if returned by your API
                  });
                })
              );
              setMessage("Added to wishlist!");
              setModalVisible(true);
            }
          } catch (error) {
            setMessage("This product is already in your wishlist!");
            setModalVisible(true);
          }
        },
      }).unwrap();
    } catch (error) {
      setMessage("This product is already in your wishlist!");
      setModalVisible(true);
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
          <TouchableOpacity onPress={handleAddToWishList} disabled={isLoading}>
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
            <Text style={{ color: message.includes("already") || message.includes("Error") ? "red" : "green", fontSize: 18 }}>
              {message}
            </Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 20,
                backgroundColor: "#DDDDDD",
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
