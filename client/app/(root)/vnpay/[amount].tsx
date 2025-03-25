import {
  View,
  Text,
  Alert,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/redux/constant";
import WebView from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router"; // Để điều hướng đến trang /order
import { useCreateOrderMutation, useCreateOrderNowMutation } from "@/redux/api/orderApiSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { clearCartState } from "@/redux/features/cart/cartSlice";

const Test = () => {
  const [url, setUrl] = useState("");
  const [showWebView, setShowWebView] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const router = useRouter(); // Để redirect đến trang /order

  const dispatch = useDispatch<AppDispatch>();

  const { amount } = useLocalSearchParams<{ amount?: string }>();
  const { orderItems } = useLocalSearchParams<{ orderItems?: string }>();
  const { isFromCart } = useLocalSearchParams<{ isFromCart?: string }>();
  const decodeOrderItems = orderItems
    ? JSON.parse(decodeURIComponent(orderItems))
    : [];

  const handleLink = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/checkout/create_payment_url`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount) * 1000,
            bankCode: "",
            language: "vn",
          }),
        }
      );

      const result = await response.json();
      if (result.code === "00" && result.data?.paymentUrl) {
        setUrl(result.data.paymentUrl);
        setShowWebView(true);
      } else {
        Alert.alert("Lỗi", result.message || "Không thể tạo link thanh toán.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server.");
    }
  };
  const [createOrderNow] = useCreateOrderNowMutation();
  const [createOrder] = useCreateOrderMutation();

  useEffect(() => {
    const updatedOrderData = {
      ...decodeOrderItems, // Giữ lại các dữ liệu orderItems đã được mã hóa
      code: paymentCode, // Set paymentCode vào orderData
    };

    // Nếu bạn cần truyền lại updatedOrderData đến trang sau, bạn có thể mã hóa lại hoặc lưu vào state.
    console.log("Updated Order Data with Payment Code:", updatedOrderData);
    // handleCreateOrderNow(updatedOrderData)

    if (isFromCart === "true") {
      if (paymentCode === "00") {
        // Alert.alert("Thanh toán thành công", "Clear Cart ddi");
        handleCreateOrder(updatedOrderData)
        dispatch(clearCartState());
      }
    } else if (isFromCart === "false") {
      handleCreateOrderNow(updatedOrderData);
    }
  }, [paymentCode]);

  const handleCreateOrderNow = async (orderData) => {
    try {
      const response = await createOrderNow(orderData).unwrap();
      console.log("====================================");
      console.log(response);
      console.log("====================================");
      // router.push("/order"); // Điều hướng đến trang đơn hàng
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };
  const handleCreateOrder = async (orderData) => {
    try {
      const response = await createOrder(orderData).unwrap();
      console.log("====================================");
      console.log(response);
      console.log("====================================");
      // router.push("/order"); // Điều hướng đến trang đơn hàng
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const handleRedirect = () => {
    router.push("/order"); // Redirect đến trang /order
  };

  return (
    <View style={{ flex: 1 }}>
      {!showWebView ? (
        <Button title="Thanh toán với VNPay" onPress={handleLink} />
      ) : (
        <WebView
          source={{ uri: url }}
          style={{ flex: 1 }}
          onError={(error) => {
            console.log("WebView Error:", error); // Log lỗi WebView
          }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes("vnpay_return")) {
              // Nếu URL trả về chứa vnpay_return, tức là VNPay trả kết quả thanh toán
              fetch(navState.url) // Gửi yêu cầu tới returnUrl
                .then((response) => response.json())
                .then((data) => {
                  setPaymentStatus(data.success ? "success" : "failure");
                  setPaymentMessage(data.message);
                  setPaymentCode(data.code);
                  setModalVisible(true); // Hiển thị modal thông báo
                  setShowWebView(false); // Ẩn WebView
                  // Cập nhật orderData với paymentCode
                  // const updatedOrderData = {
                  //   ...decodeOrderItems,  // Giữ lại các dữ liệu orderItems đã được mã hóa
                  //   code: data.code,  // Set paymentCode vào orderData
                  // };

                  // // Nếu bạn cần truyền lại updatedOrderData đến trang sau, bạn có thể mã hóa lại hoặc lưu vào state.
                  // console.log('Updated Order Data with Payment Code:', updatedOrderData);
                })
                .catch((error) => {
                  console.log("Error fetching payment result:", error);
                });
            }
          }}
        />
      )}

      {/* Modal thông báo kết quả thanh toán */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}
            >
              Kết quả thanh toán
            </Text>
            <Text style={{ marginTop: 20, fontSize: 16 }}>
              Status: {paymentStatus === "success" ? "Thành công" : "Thất bại"}
            </Text>
            <Text style={{ marginTop: 10, fontSize: 16 }}>
              Message: {paymentMessage}
            </Text>
            <Text style={{ marginTop: 10, fontSize: 16 }}>
              Code: {paymentCode}
            </Text>

            <TouchableOpacity
              onPress={handleRedirect}
              style={{
                backgroundColor: "#4CAF50",
                padding: 10,
                marginTop: 20,
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                Đi đến Đơn hàng
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: "#f44336",
                padding: 10,
                marginTop: 10,
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Test;
