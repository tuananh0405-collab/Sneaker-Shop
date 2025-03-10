import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const params = useLocalSearchParams<{ search?: string }>();
  const [search, setSearch] = useState(params.search || "");
  const [modalVisible, setModalVisible] = useState(false);

  // Filter states
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Hàm debounce tìm kiếm
  const debouncedSearch = useDebouncedCallback((text: string) => {
    router.setParams({ search: text });
  }, 500);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  // Hiển thị Modal
  const handleFilterPress = () => {
    setModalVisible(true);
  };

  // Đóng Modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Xử lý áp dụng bộ lọc
  const handleApplyFilters = () => {
    setModalVisible(false); // Đóng modal khi áp dụng bộ lọc
    router.setParams({size: selectedSize})
    router.setParams({color: selectedColor })
    router.setParams({gender: selectedGender})
    router.setParams({minPrice: minPrice, maxPrice: maxPrice})
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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

        <TouchableOpacity onPress={handleFilterPress}>
          <Image source={icons.filter} className="size-5" />
        </TouchableOpacity>

        {/* Modal cho Filter */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View className="flex-1 justify-end items-center bg-opacity-50 ">
              <TouchableWithoutFeedback>
                <View
                  className="bg-white w-full p-5 rounded-t-xl"
                  style={{ maxHeight: "50%" }}
                >
                  <Text className="text-lg font-rubik-bold mb-4">
                    Filter Options
                  </Text>

                  {/* Các bộ lọc */}
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="mb-4">
                      <Text className="font-rubik">Size</Text>
                      <View className="flex-row">
                        {["S", "M", "L", "XL", "XXL"].map((size) => (
                          <TouchableOpacity
                            key={size}
                            onPress={() => setSelectedSize(size)}
                            style={{
                              backgroundColor: selectedSize === size ? "#d1d1d1" : "transparent",
                              padding: 5,
                              margin: 5,
                              borderRadius: 5,
                            }}
                          >
                            <Text>{size.toUpperCase()}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="font-rubik">Color</Text>
                      <View className="flex-row">
                        {["Black", "Red", "Blue", "Golden"].map((color) => (
                          <TouchableOpacity
                            key={color}
                            onPress={() => setSelectedColor(color)}
                            style={{
                              backgroundColor: selectedColor === color ? "#d1d1d1" : "transparent",
                              padding: 5,
                              margin: 5,
                              borderRadius: 5,
                            }}
                          >
                            <Text>{color}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="font-rubik">Gender</Text>
                      <View className="flex-row">
                        {["Men", "Woman", "Unisex"].map((gender) => (
                          <TouchableOpacity
                            key={gender}
                            onPress={() => setSelectedGender(gender)}
                            style={{
                              backgroundColor: selectedGender === gender ? "#d1d1d1" : "transparent",
                              padding: 5,
                              margin: 5,
                              borderRadius: 5,
                            }}
                          >
                            <Text>{gender.charAt(0).toUpperCase() + gender.slice(1)}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="font-rubik">Price Range</Text>
                      <TextInput
                        placeholder="Min Price"
                        value={minPrice}
                        onChangeText={setMinPrice}
                        className="border border-primary-200 p-2 rounded-md mb-2"
                      />
                      <TextInput
                        placeholder="Max Price"
                        value={maxPrice}
                        onChangeText={setMaxPrice}
                        className="border border-primary-200 p-2 rounded-md"
                      />
                    </View>

                    <View className="flex-row justify-between">
                      <Button title="Apply" onPress={handleApplyFilters} />
                      <Button title="Cancel" onPress={handleCloseModal} />
                    </View>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Search;
