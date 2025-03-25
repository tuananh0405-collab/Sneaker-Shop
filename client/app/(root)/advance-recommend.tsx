import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/Cards";
import NoResults from "@/components/NoResults";
import icons from "@/constants/icons";
import { useLazyGetRecommendedProductsWithReasonQuery } from "@/redux/api/productApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Picker } from "@react-native-picker/picker";

const AdvanceRecommend = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // State for filters
  const [useUserData, setUseUserData] = useState(false);
  const [recommendQuantity, setRecommendQuantity] = useState(5);
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // API call (triggered only when "Recommend" button is pressed)
  const [fetchRecommendations, { data: dataRecommend, isLoading, error }] =
    useLazyGetRecommendedProductsWithReasonQuery();

  // Call API only when button is pressed
  const handleSearch = async () => {
    try {
      const response = await fetchRecommendations({
        userId: useUserData ? user?.user?._id : "",
        recommendQuantity,
        description,
      }).unwrap();

      // If the API fails but doesn't throw an error, handle empty response
      if (!response?.data?.recommendedProducts?.length) {
        setErrorMessage("No products found.");
      }
    } catch (err) {
      setErrorMessage("Error fetching recommendations.");
    }
  };

  const products = error ? [] : dataRecommend?.data?.recommendedProducts || [];
  const recommendationReason = error
    ? []
    : dataRecommend?.data?.reason || "No reason provided.";

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <Card
            item={item}
            onPress={() => handleCardPress(item._id)}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              size="large"
              className="text-primary-300 mt-5"
            />
          ) : !dataRecommend && !errorMessage ? null : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            {/* Header */}
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image
                  source={icons.backArrow}
                  className="size-5"
                />
              </TouchableOpacity>

              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Suggest Your Ideal Sneakers
              </Text>
              <TouchableOpacity onPress={() => router.navigate("/cart")}>
                <Image
                  source={icons.cart}
                  className="size-6"
                />
              </TouchableOpacity>
            </View>

            {/* Input field for description */}
            <View className="mt-5">
              <Text className="text-sm font-rubik-medium text-black-300">
                Description
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 mt-2 text-black-300"
                placeholder="Describe your ideal sneakers..."
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Two dropdowns in one row */}
            <View className="flex flex-row gap-5 mt-5">
              {/* Dropdown 1: Use User Data */}
              <View className="flex-1">
                <Text className="text-sm font-rubik-medium text-black-300">
                  Use Your Data?
                </Text>
                <Picker
                  selectedValue={useUserData}
                  onValueChange={(itemValue) => setUseUserData(itemValue)}
                  className="border border-gray-300 rounded-md mt-2"
                >
                  <Picker.Item
                    label="No"
                    value={false}
                  />
                  <Picker.Item
                    label="Yes"
                    value={true}
                  />
                </Picker>
              </View>

              {/* Dropdown 2: Number of Recommendations */}
              <View className="flex-1">
                <Text className="text-sm font-rubik-medium text-black-300">
                  Number of Products
                </Text>
                <Picker
                  selectedValue={recommendQuantity}
                  onValueChange={(itemValue) => setRecommendQuantity(itemValue)}
                  className="border border-gray-300 rounded-md mt-2"
                >
                  <Picker.Item
                    label="3"
                    value={3}
                  />
                  <Picker.Item
                    label="5"
                    value={5}
                  />
                  <Picker.Item
                    label="7"
                    value={7}
                  />
                </Picker>
              </View>
            </View>

            {/* Recommend Button */}
            <TouchableOpacity
              onPress={handleSearch}
              className="bg-primary-300 rounded-md p-3 mt-5 items-center"
            >
              <Text className="text-white font-rubik-medium">Recommend</Text>
            </TouchableOpacity>

            {/* Box to show recommendation reason */}
            {products.length > 0 && (
              <View className="bg-gray-100 rounded-md p-4 mt-5">
                <Text className="text-sm font-rubik-medium text-black-300">
                  Why These Products?
                </Text>
                <Text className="text-black-300 mt-2">
                  {recommendationReason}
                </Text>
              </View>
            )}

            {/* Show results count */}
            {products.length > 0 && (
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {products.length} results
              </Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AdvanceRecommend;
