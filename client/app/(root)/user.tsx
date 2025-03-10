import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { useGetUserQuery, useUpdateUserMutation } from '@/redux/api/userApiSlice';
import { RootState } from '@/redux/store'; // Đảm bảo bạn đã cấu hình store đúng

const User = () => {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.auth.user); // Lấy user từ Redux store
  const userId = userInfo?.user?._id;

  // Dùng hook query để lấy thông tin người dùng
  const { data, isLoading, error } = useGetUserQuery(userId);
  const user = data?.data;

  // State để lưu các thông tin chỉnh sửa
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Mutation để cập nhật thông tin người dùng
  const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation();

  // Cập nhật thông tin người dùng khi bấm "Save"
  const handleSave = async () => {
    try {
      const updates = { name, email, phone };
      await updateUser({ id: userId!, updates }).unwrap(); // unwrap để lấy dữ liệu trực tiếp
      Alert.alert('Success', 'User details updated successfully!', [{ text: 'OK', onPress: () => router.replace('/profile') }]);
    } catch (error) {
      Alert.alert('Failed', 'Failed to update user details.', [{ text: 'OK' }]);
    }
  };

  // Hủy bỏ thay đổi và quay lại trang Profile
  const handleCancel = () => {
    router.replace('/profile');
  };

  // Hiển thị khi đang tải dữ liệu
  if (isLoading) {
    return <Text>Loading user details...</Text>;
  }

  // Hiển thị khi có lỗi
  if (error) {
    return <Text>Error loading user details</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>User Details</Text>

      <View style={{ marginBottom: 20 }}>
        <Text>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10 }}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10 }}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Phone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10 }}
        />
      </View>

      <Button
        title={isUpdating ? 'Saving...' : 'Save'}
        onPress={handleSave}
        disabled={isUpdating}
      />
      <Button
        title="Cancel"
        onPress={handleCancel}
        color="red"
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

export default User;
