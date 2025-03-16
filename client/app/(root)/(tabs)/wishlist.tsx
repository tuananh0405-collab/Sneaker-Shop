import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { useGetWishlistQuery, useRemoveFromWishListMutation } from "@/redux/api/wishlistApiSlice";
import icons from "@/constants/icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Wishlist = () => {
  const [email, setEmail] = useState<string>("");

  // Get the user's email from AsyncStorage
  useEffect(() => {
    const getUserInfo = async () => {
      const emailStoraged = await AsyncStorage.getItem("userEmail");
      if (emailStoraged) {
        setEmail(emailStoraged); // Set the email in state
        console.log(email)
      }
    };
    getUserInfo();
  }, []);

  // Fetch the wishlist data using the user's email
  const { data, isLoading, error, refetch } = useGetWishlistQuery(email, {
    skip: !email, // Only run the query if email is available
  });

  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishListMutation();
  const router = useRouter();
  const windowHeight = Dimensions.get("window").height;

  // Function to remove item from wishlist
  const handleRemoveItem = async (productId: string) => {
    try {
      if (!email) {
        Alert.alert("Error", "No user email found");
        return;
      }
      await removeFromWishlist({ productId, email }).unwrap();
      refetch(); // Refresh wishlist after removing item
    } catch (err) {
      Alert.alert("Error", "Failed to remove item from wishlist");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }
  // Error State
  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Failed to load wishlist</Text>
      </View>
    );
  }

  // Render wishlist items if they exist
  const renderItem = ({ item }: { item: any }) => {
    console.log(item); // Debug to ensure item structure
    return (
      <View className="flex flex-row items-center justify-between mb-4 border-b border-gray-300 pb-2">
        <Image
          source={{ uri: item.image }} // Ensure 'image' field exists
          className="w-16 h-16 rounded-md"
        />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-rubik-medium">{item.productName}</Text> {/* Adjust property names */}
        </View>

        <TouchableOpacity
          onPress={() => handleRemoveItem(item.id)} // Use the correct productId
          className="ml-3"
        >
          <Image source={icons.trash} className="w-6 h-6" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, backgroundColor: "white" }}
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            className="size-full"
            style={{ height: 450 }}
            resizeMode="cover"
          />
        </View>

        <View className="px-4">
          <Text className="text-2xl font-rubik-bold my-5">Wishlist</Text>
          {data?.data.wishList.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-lg font-rubik-medium text-gray-500">
                Your wishlist is empty
              </Text>
            </View>
          ) : (
            <FlatList
              data={data?.data.wishList} // Data from the query
              keyExtractor={(item) => item.id} // Use the correct identifier
              renderItem={renderItem}
            />
          )}
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-20 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <TouchableOpacity
          className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
          onPress={() => router.replace("/checkout")} // Navigate to checkout or another screen
        >
          <Text className="text-white text-lg text-center font-rubik-bold">
            Checkout Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Wishlist;
