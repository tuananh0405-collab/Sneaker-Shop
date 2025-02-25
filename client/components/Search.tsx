import { View, Text, Image, TextInput, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import icons from "@/constants/icons";
import { useDebouncedCallback } from "use-debounce";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/features/product/productSlice";

const Search = () => {
  const params = useLocalSearchParams<{ search?: string; category?: string }>();
  const [search, setSearch] = useState(params.search || "");
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCategory, setSelectedCategory] = useState(
    params.category || ""
  );

  const debouncedSearch = useDebouncedCallback((text: string) => {
    router.setParams({ search: text, category: selectedCategory });
    dispatch(fetchProducts({ search: text, category: selectedCategory }));
  }, 500);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  return (
    <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search for anything"
          className="text-sm font-rubik text-black-300 ml-2 flex-1"
        />
      </View>

      <TouchableOpacity onPress={toggleModal} >
        <Image source={icons.filter} className="size-5" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible} // Check if the Modal should be visible
        animationType="slide" // Set the animation type when the Modal appears
        transparent={true} // Display Modal with transparent background
        onRequestClose={toggleModal} // Handle when the close button is pressed
      >
      <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
            <Text className="text-xl font-semibold mb-4">Modal Title</Text>
            <Text className="text-sm text-gray-700 mb-4">
              Modal helps to display content that pops up on the screen. It can
              be used for notifications, confirmations, or gathering user data.
            </Text>
            <TouchableOpacity
              onPress={toggleModal}
              className="bg-blue-500 px-4 py-2 rounded-full"
            >
              <Text className="text-white text-center text-sm">Close Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Search;
