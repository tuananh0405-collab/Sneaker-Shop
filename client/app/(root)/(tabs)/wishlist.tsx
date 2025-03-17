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
  ScrollView,
} from "react-native";
import { useGetWishlistQuery, useRemoveFromWishListMutation } from "@/redux/api/wishlistApiSlice";
import icons from "@/constants/icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Wishlist = () => {
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    const getUserInfo = async () => {
      const emailStoraged = await AsyncStorage.getItem("userEmail");
      if (emailStoraged) {
        setEmail(emailStoraged);
        console.log("Email:", emailStoraged);
      }
    };
    getUserInfo();
  }, []);

  const { data, isLoading, error,refetch } = useGetWishlistQuery(email, {
    skip: !email,
  });

  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishListMutation();

  const handleRemoveItem = async (productId: string) => {
    try {
      if (!email) {
        Alert.alert("Error", "No user email found");
        return;
      }
  
      await removeFromWishlist({ productId, email }).unwrap();
  
      // Gọi lại API để cập nhật danh sách
      refetch();
    } catch (err) {
      console.log("Error removing item:", err);
      Alert.alert("Error", "Failed to remove item from wishlist");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error) {
    console.log("Error fetching wishlist:", error);
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Failed to load wishlist</Text>
      </View>
    );
  }

  console.log("Wishlist Data:", data);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View className="flex flex-row items-center justify-between mb-4 border-b border-gray-300 pb-2">
        <Image source={{ uri: item.image }} className="w-16 h-16 rounded-md" />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-rubik-medium">{item.productName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleRemoveItem(item.productId)} // Use productId for removal
          className="ml-3"
          disabled={isRemoving}
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
          <Image className="size-full" style={{ height: 450 }} resizeMode="cover" />
        </View>

        <View className="px-4">
          <Text className="text-2xl font-rubik-bold my-5">Wishlist</Text>
          {!data?.data?.wishList || data?.data?.wishList.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-lg font-rubik-medium text-gray-500">
                Your wishlist is empty
              </Text>
            </View>
          ) : (
            <FlatList
              data={data?.data?.wishList}
              keyExtractor={(item) => item.id} // Use id (wishlist item _id) as key
              renderItem={renderItem}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Wishlist;