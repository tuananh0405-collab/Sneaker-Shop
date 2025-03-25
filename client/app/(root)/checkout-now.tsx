import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";
import { useGetCouponsQuery } from "@/redux/api/couponApiSlice";
import { useGetAddressListQuery } from "@/redux/api/addressApiSlice";
import { useCreateOrderNowMutation } from "@/redux/api/orderApiSlice";
import { useCreatePaymentUrlMutation } from "@/redux/api/checkoutApiSlice";
import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { BASE_URL } from "@/redux/constant";

const CheckoutNow = () => {
  const router = useRouter();
  const { orderItems: orderItemsParam } = useLocalSearchParams();
  const orderItems = orderItemsParam ? JSON.parse(orderItemsParam) : [];
  if (orderItems.length === 0) {
    Alert.alert("Error", "No order items found.");
    return;
  }
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
  const [couponId, setCouponId] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: addressData } = useGetAddressListQuery();
  const [createOrderNow] = useCreateOrderNowMutation();
  const [createPaymentUrl] = useCreatePaymentUrlMutation();

  const {
    data: couponsData,
    error: couponError,
    isLoading: isCouponsLoading,
  } = useGetCouponsQuery();

  const totalPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const priceAfterDiscount = totalPrice * ((100 - discount) / 100);

  const validCoupons =
    couponsData?.data.coupons.filter(
      (coupon) => new Date(coupon.expiry) > new Date()
    ) || [];

  const handleCouponApply = () => {
    if (couponCode.trim() === "") {
      Alert.alert("Please enter a coupon code.");
      return;
    }

    if (couponsData) {
      const coupon = validCoupons.find(
        (c) => c.name.toLowerCase() === couponCode.trim().toLowerCase()
      );
      if (coupon) {
        setDiscount(coupon.discount);
        setCouponId(coupon._id);
        Alert.alert(`Coupon applied!`);
      } else {
        Alert.alert("Error", "Could not fetch coupon data.");
      }
    } else if (couponError) {
      Alert.alert(
        "Coupon not found.",
        "The coupon code you entered is not valid."
      );
    }
  };

  const handleApplyCoupon = (coupon) => {
    setDiscount(coupon.discount);
    setCouponId(coupon._id);

    Alert.alert("Coupon applied!");
  };

  const handleSubmit = async () => {
    if (!selectedAddressId && (!location || !fullName || !phone || !city)) {
      Alert.alert("Please enter an address before submitting.");
      return;
    }
    // Dữ liệu đơn hàng
    const orderData = {
      orderItems: orderItems.map((item) => ({
        product: item.product, // product ID
        name: item.name, // tên sản phẩm
        image: item.image, // ảnh sản phẩm
        price: item.price, // giá sản phẩm
        size: item.size, // kích cỡ
        color: item.color, // màu sắc
        quantity: item.quantity, // số lượng
      })),
      addressId: selectedAddressId, // ID của địa chỉ đã chọn
      fullName: fullName, // tên người nhận
      phone: phone, // số điện thoại
      location: location, // địa chỉ chi tiết
      city: city, // thành phố
      country: country, // quốc gia
      paymentMethod: paymentMethod, // phương thức thanh toán (COD)
      totalPrice: totalPrice, // tổng giá trị trước khi giảm
      couponId: couponId, // mã coupon
      priceAfterDiscount: priceAfterDiscount, // giá trị sau khi giảm
      code: "", // nếu cần mã thì thay đổi tại đây
    };

    try {
      if (paymentMethod === "VNPAY") {
        // Gọi API VNPAY để xử lý thanh toán
        const response = await createPaymentUrl({
          amount: priceAfterDiscount,
          bankCode: "",
          language: "vn",
        });
        if (response?.data?.message === "Success") {
          // Nếu thanh toán thành công, cập nhật đơn hàng và điều hướng đến trang VNPAY
          const orderDataWithCode = {
            ...orderData,
            code: response?.data?.code, // Giả sử trả về mã thanh toán
          };
          await createOrderNow(orderDataWithCode);
          router.push("/order"); // Điều hướng đến trang đơn hàng
        } else {
          // Nếu thanh toán thất bại, quay lại trang giỏ hàng
          Alert.alert("Payment failed", "Transaction could not be completed.");
          router.replace("/cart");
        }
      } else {
        // Xử lý thanh toán COD
        await createOrderNow(orderData);
        router.push("/order");
      }
    } catch (error) {
      // Xử lý lỗi trong trường hợp không thể tạo đơn hàng
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

  const handlePayment = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/checkout/create_payment_url`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: priceAfterDiscount*1000,
            bankCode: "",
            language: "vn",
            
          }),
        }
      );

      const result = await response.json();
      if (result.code === "00" && result.data?.paymentUrl) {
        Linking.openURL(result.data.paymentUrl);
      } else {
        Alert.alert("Lỗi", result.message || "Không thể tạo link thanh toán.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server.");
    }
  };

  useEffect(() => {
    const handleUrl = (url) => {
      // Kiểm tra xem URL có chứa custom scheme của ứng dụng không
      if (url.includes("yourapp://payment")) {
        const params = new URLSearchParams(url.split('?')[1]);
        const status = params.get('status');
        const message = params.get('message');
  
        if (status === 'success') {
          Alert.alert("Thanh toán thành công", message);
          // Điều hướng đến trang đơn hàng
          router.push("/order");
        } else {
          Alert.alert("Thanh toán thất bại", message);
          // Điều hướng về trang giỏ hàng
          router.push("/cart");
        }
      }
    };
  
    // Lắng nghe khi ứng dụng được mở từ URL
    const subscription = Linking.addEventListener('url', (event) => handleUrl(event.url));
  
    // Kiểm tra nếu ứng dụng được mở từ URL scheme khi đang ở background
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      }
    });
  
    // Dọn dẹp khi component unmounts
    return () => {
      subscription.remove();  // Hủy sự kiện
    };
  }, []);
  
  const openVnPay = (amount) =>{
    const orderData = {
      orderItems: orderItems.map((item) => ({
        product: item.product, // product ID
        name: item.name, // tên sản phẩm
        image: item.image, // ảnh sản phẩm
        price: item.price, // giá sản phẩm
        size: item.size, // kích cỡ
        color: item.color, // màu sắc
        quantity: item.quantity, // số lượng
      })),
      addressId: selectedAddressId, // ID của địa chỉ đã chọn
      fullName: fullName, // tên người nhận
      phone: phone, // số điện thoại
      location: location, // địa chỉ chi tiết
      city: city, // thành phố
      country: country, // quốc gia
      paymentMethod: paymentMethod, // phương thức thanh toán (COD)
      totalPrice: totalPrice, // tổng giá trị trước khi giảm
      couponId: couponId, // mã coupon
      priceAfterDiscount: priceAfterDiscount, // giá trị sau khi giảm
      code: "", // nếu cần mã thì thay đổi tại đây
    };

    const encodedOrderData = encodeURIComponent(JSON.stringify(orderData));
    // router.navigate(`/vnpay/${amount}`)
    router.push(`/vnpay/${amount}?orderItems=${encodedOrderData}&isFromCart=false`);

  }


  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={[1]} // Adding a dummy element to make FlatList work as the outer scroll
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View className="flex flex-row items-center justify-between p-4">
              <TouchableOpacity onPress={() => router.replace("/cart")}>
                <Image source={icons.backArrow} className="w-6 h-6" />
              </TouchableOpacity>
              <Text className="text-xl font-bold">Checkout Now</Text>
              <View></View>
            </View>

            {/* Products List */}
            <View className="px-4">
              <Text className="text-2xl font-bold mb-4">Your Order</Text>
              <FlatList
                data={orderItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderProductItem}
              />
            </View>

            {/* Coupon List */}
            {validCoupons.length > 0 && (
              <View className="px-4 mt-4">
                <Text className="text-lg font-bold">Available Coupons</Text>
                <FlatList
                  data={validCoupons}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <View className="flex flex-row items-center justify-between mb-2 p-3 border-b border-gray-300">
                      <Text>{item.name}</Text>
                      <Text className="text-primary-300 font-bold">
                        {item.discount}% Off
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleApplyCoupon(item)}
                        className="bg-primary-300 p-2 rounded-lg"
                      >
                        <Text className="text-white">Apply</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}

            {/* Price and Discount */}
            <View className="px-4 mt-4">
              <Text className="text-lg font-medium">
                Total Price: ${totalPrice}
              </Text>
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
              {selectedAddressId !== null && (
                <View className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <Text className="font-medium text-lg">
                    {
                      addressData?.data.find(
                        (address) => address._id === selectedAddressId
                      )?.fullName
                    }
                  </Text>
                  <Text>
                    {
                      addressData?.data.find(
                        (address) => address._id === selectedAddressId
                      )?.location
                    }
                  </Text>
                  <Text>
                    {
                      addressData?.data.find(
                        (address) => address._id === selectedAddressId
                      )?.city
                    }
                    ,{" "}
                    {
                      addressData?.data.find(
                        (address) => address._id === selectedAddressId
                      )?.country
                    }
                  </Text>
                </View>
              )}
              {selectedAddressId === null && (
                <View className="mt-4">
                  <TextInput
                    placeholderTextColor={"gray"}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    className="border border-gray-300 rounded-lg p-2 mb-2"
                  />
                  <TextInput
                    placeholder="Phone"
                    placeholderTextColor={"gray"}
                    value={phone}
                    onChangeText={setPhone}
                    className="border border-gray-300 rounded-lg p-2 mb-2"
                  />
                  <TextInput
                    placeholder="Location"
                    placeholderTextColor={"gray"}
                    value={location}
                    onChangeText={setLocation}
                    className="border border-gray-300 rounded-lg p-2 mb-2"
                  />
                  <TextInput
                    placeholder="City"
                    placeholderTextColor={"gray"}
                    value={city}
                    onChangeText={setCity}
                    className="border border-gray-300 rounded-lg p-2 mb-2"
                  />
                  <TextInput
                    placeholder="Country"
                    placeholderTextColor={"gray"}
                    value={country}
                    onChangeText={setCountry}
                    className="border border-gray-300 rounded-lg p-2 mb-4"
                  />
                </View>
              )}
              <Modal
                visible={isModalVisible}
                transparent={false}
                animationType="none"
                onRequestClose={() => setIsModalVisible(false)}
              >
                <View className="flex-1 justify-center items-center bg-black opacity-50">
                  <View className="bg-white rounded-lg p-4 w-80">
                    <Text className="text-xl font-bold mb-4">
                      Select Address
                    </Text>
                    <FlatList
                      data={addressData?.data}
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
            </View>

            {/* Payment Method */}
            <View className="px-4 mt-4">
              <Text className="text-xl font-bold">Payment Method</Text>
              <View className="flex flex-row items-center mt-3">
                <TouchableOpacity
                  onPress={() => Alert.alert("Error", "Payment Method not supported yet")}
                  className={`bg-gray-200 p-3 rounded-lg flex-1 ${
                    paymentMethod === "COD" ? "bg-primary-300" : ""
                  }`}
                >
                  <Text  className={`text-center ${paymentMethod==="COD"?"text-white":""}`}>COD</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("VNPAY")}
                  className={`bg-gray-200 p-3 rounded-lg flex-1 ml-2 ${
                    paymentMethod === "VNPAY" ? "bg-primary-300 " : ""
                  }`}
                >
                  <Text className={`text-center ${paymentMethod==="VNPAY"?"text-white":""}`}>VNPAY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
      />
      {/* <TouchableOpacity
        onPress={handleSubmit}
        className="bg-primary-300 rounded-full p-4 m-4"
      >
        <Text className="text-white text-center text-xl font-bold">
          Confirm Order
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={()=>openVnPay(priceAfterDiscount)}
        className="bg-primary-300 rounded-full p-4 m-4"
      >
        <Text className="text-white text-center text-xl font-bold">
          Confirm
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CheckoutNow;
