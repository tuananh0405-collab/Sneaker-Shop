import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCategories } from "@/redux/features/categorySlice";
import { fetchProducts } from "@/redux/features/product/productSlice";
import { useDebouncedCallback } from "use-debounce";

const Filters = () => {
  const params = useLocalSearchParams<{search?: string, category?: string }>();
  console.log('====================================');
  console.log(params);
  console.log('====================================');
  const [selectedCategory, setSelectedCategory] = useState(
    params.category || ""
  );
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
    const [search, setSearch] = useState(params.search||'');

   const debouncedCategory = useDebouncedCallback((category: string) => {
        router.setParams({ search: search,  category: category });
        dispatch(fetchProducts({ search: search, category: category }));
  
      }, 500);
  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
      // setSelectedCategory("");
      // router.setParams({ category: "" });
      return;
    }
    setSelectedCategory(category);
    // router.setParams({ category });
    debouncedCategory(category);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      {categories.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleCategoryPress(item.name)}
          key={index}
          className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${
            selectedCategory === item.name
              ? "bg-primary-300"
              : "bg-primary-100 border border-primary-200"
          }`}
        >
          <Text
            className={`text-sm ${
              selectedCategory === item.name
                ? "text-white font-rubik-bold mt-0.5"
                : "text-black-300 font-rubik"
            }`}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Filters;
