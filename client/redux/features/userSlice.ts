import { AUTH_URL, BASE_URL, USER_URL } from "@/constants/route";
import { User } from "@/interface";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  users: User[];
  userDetails: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  userDetails: null,
  loading: false,
  error: null,
};

// const API_BASE_URL = "http://192.168.57.104:5501/api/v1/users";
const API_BASE_URL = BASE_URL+USER_URL;

// Fetch all users
export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    return data.data;
  }
);

// Fetch user details
export const fetchUserDetails = createAsyncThunk<User, string>(
  "users/fetchUserDetails",
  async (userId) => {
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    const data = await response.json();
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    return data.data;
  }
);

// Delete user
export const deleteUser = createAsyncThunk<string, string>(
  "users/deleteUser",
  async (userId) => {
    await fetch(`${API_BASE_URL}/${userId}`, {
      method: "DELETE",
    });
    return userId;
  }
);

// Update user
export const updateUser = createAsyncThunk<User, { userId: string; userData: Partial<User> }>(
  "users/updateUser",
  async ({ userId, userData }) => {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data.data;
  }
);
export const fetchCurrentUser = createAsyncThunk<User>(
    "user/fetchCurrentUser",
    async () => {
      const response = await fetch("http://192.168.57.105:5501/api/v1/users/current", {
        credentials: "include", // Để gửi cookie
      });
      const data = await response.json();
      return data.data;
    }
  );
  
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user details";
      })
      
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      })
      
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      });
  },
});

export default userSlice.reducer;
