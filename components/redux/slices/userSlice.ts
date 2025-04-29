// import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// // Async thunks
// const loginAction = createAsyncThunk(
//   "user/loginAction",
//   async (credentials: { email: string; password: string }, user: any) => {
//     // const user = await AsyncStorage.getItem("user");
//     if (!user) {
//       throw new Error("User not found");
//     }
//     const response = await JSON.parse(user);
//     const res = response.filter(
//       (item: any) => item.email === credentials.email
//     );
//     if (res.length === 0) {
//       throw new Error("User not found");
//     }

//     const hashedPassword = await Crypto.digestStringAsync(
//       Crypto.CryptoDigestAlgorithm.SHA256,
//       credentials.password
//     );
//     if (hashedPassword !== res[0].password) {
//       throw new Error("Invalid password");
//     }
//     return { success: true, user: res[0] };
//   }
// );

// const getUser = createAsyncThunk("user/getUser", async (user: any) => {
//   if (!user) {
//     throw new Error("User not found");
//   }

//   console.log(user);
//   const lock = user.filter((u: any) => !u.pin);
//   console.log(lock, user, "87");
//   if (lock.length === 0) {
//     return { lock: false, length: user.length, users: user };
//   }
//   return { lock: lock[0], length: user.length, users: user };
// });

// const updateUser = createAsyncThunk(
//   "user/updateUser",
//   async (data: {
//     name: string;
//     email: string;
//     profileImage: string;
//     id: string;
//   }) => {
// const user = await AsyncStorage.getItem("user");
// if (!user) {
//   throw new Error("User not found");
// }
// let users = await JSON.parse(user);
// const index = users.findIndex((item: any) => item.id === data.id);
// if (index === -1) {
//   throw new Error("User not found");
// }
// users[index] = { ...users[index], ...data };
// await AsyncStorage.setItem("user", JSON.stringify(users));
// return users[index];
//   }
// );

// const addPin = createAsyncThunk(
//   "user/addPin",
//   async (user: { id: string; pin: string }) => {
//     // const users = await AsyncStorage.getItem("user");
//     // let users2 = await JSON.parse(users || "");
//     // users2 = await JSON.parse(users2);
//     // if (!users) {
//     //   throw new Error("User not found");
//     // }
//     // console.log(users2);
//     // const index = await users2.findIndex((item: any) => item.id === user.id);
//     // if (index === -1) {
//     //   throw new Error("User not found");
//     // }
//     // users2[index] = { ...users2[index], pin: user.pin };
//     // await AsyncStorage.setItem("user", JSON.stringify(users));
//     // return users[index];
//   }
// );

interface UserState {
  user: any;
  loading: boolean;
  error: string | null;
  nUser: null | number;
  login: boolean;
  message: string | null;
  updated: boolean;
  secure: boolean;
  lock: boolean;
  users: any;
}

const initialState: UserState = {
  user: null,
  loading: true,
  error: null,
  nUser: null,
  login: false,
  lock: false,
  message: null,
  updated: false,
  secure: false,
  users: null,
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUser: (state) => {
      state.login = false;
      state.message = null;
      state.updated = false;
    },
    signup: (state, action) => {
      state.user = action.payload;
      state.nUser = state.nUser ? state.nUser + 1 : 1;
      state.login = true;
      state.message = "Signup successful";
      state.users = state.users
        ? [...state.users, state.user]
        : [action.payload];
    },
    loginAction: (state, action) => {
      state.user = action.payload.user;
      state.message = "Login successful";
      state.login = true;
      state.nUser = state.nUser ? state.nUser + 1 : 1;
    },
    logout: (state, action) => {
      state.user = null;
      state.login = false;
      state.users = action.payload;
    },
    getUser: (state, action) => {
      if (state.users) return;
      state.loading = false;
      if (action.payload.lock) {
        state.user = action.payload.lock;
      }
      state.users = action.payload.users;
      state.nUser = action.payload.length || 0;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      state.message = "Update successful";
      state.updated = true;
      state.secure = true;
    },
    addPin: (state, action) => {
      state.message = "Pin added";
      state.lock = false;
      state.secure = true;
      state.users = action.payload.users;
      state.user = action.payload.user;
    },
    checkPin: (state, action) => {
      state.user = action.payload;
      state.message = "Pin correct";
      state.secure = true;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    changeProfile: (state, action) => {
      state.user = action.payload;
      state.message = "Profile updated";
      state.updated = true;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(loginAction.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(loginAction.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.user = action.payload.user;
    //     state.message = "Login successful";
    //     state.login = true;
    //     state.nUser = state.nUser ? state.nUser + 1 : 1;
    //   })
    //   .addCase(loginAction.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message || "Failed to login";
    //   })
    // Signup
    // .addCase(signup.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(signup.fulfilled, (state, action) => {
    //   state.loading = false;
    //   // state.user = action.payload.user;
    //   state.nUser = state.nUser ? state.nUser + 1 : 1;
    //   state.login = true;
    //   state.message = "Signup successful";
    // })
    // .addCase(signup.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message || "Failed to signup";
    // })
    // Get user
    // builder
    //   .addCase(getUser.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getUser.fulfilled, (state, action) => {
    //     if (action.payload.lock) {
    //       state.user = action.payload.lock;
    //     }
    //     state.loading = false;
    //     state.nUser = action.payload.length;
    //     state.users = action.payload.users;
    //   })
    //   .addCase(getUser.rejected, (state, action) => {
    //     state.loading = false;
    //     state.nUser = 0;
    //     console.log(action.error.message);
    //   })
    //   // Update user
    //   .addCase(updateUser.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(updateUser.fulfilled, (state, action) => {
    //     state.loading = false;
    //   })
    //   .addCase(updateUser.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message || "Failed to update";
    //   });
    // // Check pin
    // builder
    //   .addCase(checkPin.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(checkPin.fulfilled, (state, action) => {
    //     state.loading = false;
    //   })
    //   .addCase(checkPin.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message || "Invalid pin";
    //   });
    // Add pin
    // builder
    //   .addCase(addPin.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(addPin.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.user = action.payload;
    //     state.message = "Pin added";
    //     state.lock = false;
    //   })
    //   .addCase(addPin.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message || "Failed to add pin";
    //   });
  },
});

export const {
  clearError,
  resetUser,
  signup,
  loginAction,
  logout,
  getUser,
  updateUser,
  addPin,
  checkPin,
  getError,
  changeProfile,
} = userSlice.actions;
export default userSlice.reducer;
