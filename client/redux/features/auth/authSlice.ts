// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// // Define types
// interface AuthState {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
// }

// interface User {
//   id: string;
//   email: string;
//   token: string;
// }

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// interface AuthResponse {
//   id: string;
//   email: string;
//   token: string;
// }
// //android: exp://192.168.57.105:8081
// // Async thunk for email login
// export const loginWithEmail = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
//   "auth/loginWithEmail",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://192.168.57.105:5501/api/v1/auth/sign-in", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         throw new Error("Invalid email or password");
//       }

//       const data: AuthResponse = await response.json();
//       console.log("Login successful", data);
//       return data;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Async thunk for logout
// export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
//   "auth/logoutUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://192.168.57.105:5501/api/v1/auth/sign-out", {
//         method: "POST",
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error("Logout failed");
//       }

//       console.log("Logout successful");

//       // Remove user data from AsyncStorage
//       // await AsyncStorage.removeItem("user");
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const initialState: AuthState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginWithEmail.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginWithEmail.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(loginWithEmail.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "An error occurred";
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define types
interface User {
  id: string;
  email: string;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  id: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Khai báo API URL
const API_URL = "http://192.168.57.105:5501/api/v1/auth";

// Async thunk for email login
export const loginWithEmail = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data: AuthResponse = await response.json();
      console.log("Login successful", data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/sign-out`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    console.log("Logout successful");
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
