import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { fetchProducts } from "@/redux/features/product/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import avatar from "@/assets/images/avatar.jpg";



const Home = () => {
  const params = useLocalSearchParams<{ search?: string; category?: string }>();

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);
  const handleSeeAll = () => router.push("/explore");

  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const userInfo = useSelector((state: RootState) => state.auth.user);

  const [filters, setFilters] = useState({
    search: params.search || "",
    category: params.category || "",
  });

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item._id)} />
        )}
        keyExtractor={(item) => item._id.toString()}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image
                  source={avatar}
                  // className="h-10 w-10 rounded-full border border-gray-300"
                  style={{
                    height: 40, // Adjust the size
                    width: 40, // Adjust the size
                    borderRadius: 20, // Round the image fully
                    borderWidth: 1, // Optional: add a border around the image
                    borderColor: "#E0E0E0", // Optional: set the border color
                  }}
                />

                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Good Morning
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {userInfo?.data?.user.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            <Search />

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text
                    className="text-base font-rubik-bold text-primary-300"
                    onPress={handleSeeAll}
                  >
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !products || products.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={products}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item._id)}
                    />
                  )}
                  keyExtractor={(item) => item._id}
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
            </View>

            <View className="mt-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Our Recommendation
                </Text>
                <TouchableOpacity>
                  <Text
                    className="text-base font-rubik-bold text-primary-300"
                    onPress={handleSeeAll}
                  >
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              <Filters />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
