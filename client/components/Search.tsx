import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import icons from "@/constants/icons";
import { useDebouncedCallback } from "use-debounce";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/features/productSlice";
import Slider from "@react-native-community/slider";
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

  const [selectedFilters, setSelectedFilters] = useState({
    collections: [],
    brands: [],
    categories: [],
    gender: "",
    price: 50000, // Default to 50,000
    sortBy: "Relevance",
  });

  const handleCollectionChange = (collection: string) => {
    setSelectedFilters((prev) => {
      const newCollections = prev.collections.includes(collection)
        ? prev.collections.filter((item) => item !== collection)
        : [...prev.collections, collection];
      return { ...prev, collections: newCollections };
    });
  };

  const handleBrandChange = (brand: string) => {
    setSelectedFilters((prev) => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter((item) => item !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedFilters((prev) => ({ ...prev, categories: [category] }));
  };

  const handleGenderChange = (gender: string) => {
    setSelectedFilters((prev) => ({ ...prev, gender }));
  };

  const handlePriceChange = (value: number) => {
    setSelectedFilters((prev) => ({ ...prev, price: value }));
  };

  const handleSortChange = (sortBy: string) => {
    setSelectedFilters((prev) => ({ ...prev, sortBy }));
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

      <TouchableOpacity onPress={toggleModal}>
        <Image source={icons.filter} className="size-5" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible} // Check if the Modal should be visible
        animationType="slide" // Set the animation type when the Modal appears
        transparent={true} // Display Modal with transparent background
        onRequestClose={toggleModal} // Handle when the close button is pressed
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full"  style={{ height: 550 }}>
            <Text className="text-xl font-semibold mb-4">Filters</Text>
            <ScrollView>
              {/* Collections Filter */}
              <View className="mb-4">
                <Text className="font-medium mb-2">Collections</Text>
                {[
                  "Summer Comfort",
                  "Casual Essentials",
                  "Sporty Casual",
                  "Outdoor Collection",
                ].map((collection) => (
                  <TouchableOpacity
                    key={collection}
                    onPress={() => handleCollectionChange(collection)}
                    className={`p-2 rounded-md ${
                      selectedFilters.collections.includes(collection)
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text>{collection}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Brands Filter */}
              <View className="mb-4">
                <Text className="font-medium mb-2">Brand</Text>
                {["Adidas", "Puma", "Reebok", "Converse"].map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    onPress={() => handleBrandChange(brand)}
                    className={`p-2 rounded-md ${
                      selectedFilters.brands.includes(brand)
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text>{brand}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Category Filter */}
              <View className="mb-4">
                <Text className="font-medium mb-2">Category</Text>
                {["Sandals", "Office", "Luxury", "Boots"].map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleCategoryChange(category)}
                    className={`p-2 rounded-md ${
                      selectedFilters.categories.includes(category)
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Gender Filter */}
              <View className="mb-4">
                <Text className="font-medium mb-2">Gender</Text>
                {["Men", "Women"].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    onPress={() => handleGenderChange(gender)}
                    className={`p-2 rounded-md ${
                      selectedFilters.gender === gender
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text>{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price Filter */}
              <View className="mb-4">
                <Text className="font-medium mb-2">Price</Text>
                <Slider
                  minimumValue={0}
                  maximumValue={100000}
                  step={1000}
                  value={selectedFilters.price}
                  onValueChange={handlePriceChange}
                  minimumTrackTintColor="#1E40AF"
                  maximumTrackTintColor="#D1D5DB"
                />
                <Text className="text-center">{`$${selectedFilters.price}`}</Text>
              </View>

              {/* Sort Filter */}
              <View className="mb-4">
                <Text className="font-medium mb-2">Sort By</Text>
                {["Relevance", "Price: Low to High", "Price: High to Low"].map(
                  (sortOption) => (
                    <TouchableOpacity
                      key={sortOption}
                      onPress={() => handleSortChange(sortOption)}
                      className={`p-2 rounded-md ${
                        selectedFilters.sortBy === sortOption
                          ? "bg-blue-200"
                          : "bg-gray-200"
                      }`}
                    >
                      <Text>{sortOption}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              onPress={toggleModal}
              className="bg-blue-500 px-4 py-2 rounded-full"
            >
              <Text className="text-white text-center text-sm">
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Search;
