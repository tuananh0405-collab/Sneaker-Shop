import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";
import { useGetCouponByNameQuery } from "@/redux/api/couponApiSlice";
import { useGetAddressListQuery } from "@/redux/api/addressApiSlice";
import { useCreateOrderMutation } from "@/redux/api/orderApiSlice";
const Checkout = () => {
  const router = useRouter();
  const cartState = useSelector((state: RootState) => state.cart);
  const cart = cartState.products;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: addressData } = useGetAddressListQuery();
  const [createOrder] = useCreateOrderMutation();

  const {
    data: couponDataByName,
    error,
    isLoading: isCouponLoading,
  } = useGetCouponByNameQuery(couponCode);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const priceAfterDiscount = totalPrice * ((100 - discount) / 100);

  const handleCouponApply = () => {
    if (couponCode.trim() === "") {
      Alert.alert("Please enter a coupon code.");
      return;
    }

    if (couponDataByName) {
      const coupon = couponDataByName.data.coupon;
      setDiscount(coupon.discount);
      Alert.alert(`Coupon applied! You saved ${coupon.discount}%.`);
    } else if (error) {
      Alert.alert(
        "Coupon not found.",
        "The coupon code you entered is not valid."
      );
    }
  };

  const handleSubmit = async () => {
    const orderData = {
      orderItems: cart.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })),
      addressId: selectedAddressId,
      fullName,
      phone,
      location,
      city,
      country,
      paymentMethod,
      totalPrice,
      priceAfterDiscount,
      couponId: couponCode,
      code: "",
    };

    // Simulate sending data to server
    console.log(orderData);

    try {
      await createOrder(orderData);
      router.push("/order");
    } catch (error) {
      Alert.alert("Error", "Something went wrong while placing the order.");
    }
  };

  const renderAddressItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedAddressId(item._id);
        setIsModalVisible(false);
      }}
      className="p-3 border-b border-gray-300"
    >
      <Text>{item.fullName}</Text>
      <Text>
        {item.location}, {item.city}, {item.country}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: any }) => (
    <View className="flex flex-row items-center justify-between mb-4 border-b border-gray-300 pb-2">
      <Image source={{ uri: item.image }} className="w-16 h-16 rounded-md" />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-medium">{item.name}</Text>
        <Text className="text-sm text-gray-500">
          Size: {item.size} | Color: {item.color}
        </Text>
        <Text className="text-primary-300 font-bold">
          ${item.price} x {item.quantity}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={[1]} // Adding a dummy element to make FlatList work as the outer scroll
        keyExtractor={(item) => item.toString()}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View className="flex flex-row items-center justify-between p-4">
              <TouchableOpacity onPress={() => router.replace("/cart")}>
                <Image source={icons.backArrow} className="w-6 h-6" />
              </TouchableOpacity>
              <Text className="text-xl font-bold">Checkout</Text>
              <View></View>
            </View>

            {/* Products List */}
            <View className="px-4">
              <Text className="text-2xl font-bold mb-4">Your Order</Text>
              <FlatList
                data={cart}
                keyExtractor={(item) => item.product}
                renderItem={renderProductItem}
              />
            </View>

            {/* Price and Discount */}
            <View className="px-4 mt-4">
              <Text className="text-lg font-medium">
                Total Price: ${totalPrice}
              </Text>
              <TextInput
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChangeText={setCouponCode}
                className="border border-gray-300 rounded-lg p-2 mt-2"
              />
              <TouchableOpacity
                onPress={handleCouponApply} // Simulate discount
                className="bg-primary-300 rounded-lg p-2 mt-2"
              >
                <Text className="text-white text-center">Apply Discount</Text>
              </TouchableOpacity>
              <Text className="text-lg font-medium mt-2">
                Price After Discount: ${priceAfterDiscount}
              </Text>
            </View>

            {/* Address Selection */}
            <View className="px-4 mt-4">
              <Text className="text-xl font-bold">Address</Text>
              <View className="flex flex-row items-center mt-3">
                <TouchableOpacity
                  onPress={() => setSelectedAddressId(null)}
                  className="bg-gray-200 p-3 rounded-lg flex-1"
                >
                  <Text className="text-center">Enter New Address</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(true)}
                  className="bg-gray-200 p-3 rounded-lg flex-1 ml-2"
                >
                  <Text className="text-center">Select Existing Address</Text>
                </TouchableOpacity>
              </View>
              {selectedAddressId === null && (
                <View className="mt-4">
                  <TextInput
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    className="border border-gray-300 rounded-lg p-2 mb-2"
                  />
                  <TextInput
                    placeholder="Phone"
                    value={phone}
                    onChangeText={setPhone}
                    className="border border-gray-300 rounded-lg p-2 mb-2"
                  />
                  <TextInput
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
                    className="border border-gray-300 rounded-lg p-2 mb-2"
                  />
                  <TextInput
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                    className="border border-gray-300 rounded-lg p-2 mb-2"
                  />
                  <TextInput
                    placeholder="Country"
                    value={country}
                    onChangeText={setCountry}
                    className="border border-gray-300 rounded-lg p-2 mb-4"
                  />
                </View>
              )}
              {selectedAddressId !== null && (
                <Modal
                  visible={isModalVisible}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setIsModalVisible(false)}
                >
                  <View className="flex-1 justify-center items-center bg-black opacity-50">
                    <View className="bg-white rounded-lg p-4 w-80">
                      <Text className="text-xl font-bold mb-4">
                        Select Address
                      </Text>
                      <FlatList
                        data={addressData?.data?.addresses}
                        keyExtractor={(item) => item._id}
                        renderItem={renderAddressItem}
                      />
                      <TouchableOpacity
                        onPress={() => setIsModalVisible(false)}
                        className="bg-primary-300 p-3 rounded-full mt-4"
                      >
                        <Text className="text-white text-lg text-center">
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
            </View>

            {/* Payment Method */}
            <View className="px-4 mt-4">
              <Text className="text-xl font-bold">Payment Method</Text>
              <View className="flex flex-row items-center mt-3">
                <TouchableOpacity
                  onPress={() => setPaymentMethod("COD")}
                  className={`bg-gray-200 p-3 rounded-lg flex-1 ${
                    paymentMethod === "COD" ? "bg-primary-300" : ""
                  }`}
                >
                  <Text className="text-center">COD</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("VNPAY")}
                  className={`bg-gray-200 p-3 rounded-lg flex-1 ml-2 ${
                    paymentMethod === "VNPAY" ? "bg-primary-300" : ""
                  }`}
                >
                  <Text className="text-center">VNPAY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          <>
            {/* Submit Button */}
            <View className="px-4 mt-4">
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-primary-300 p-4 rounded-full"
              >
                <Text className="text-white text-lg font-bold text-center">
                  Confirm Order
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Checkout;
