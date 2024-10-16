import { configureStore, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: { user: "" },
  reducers: {
    onLogin(state, action) {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            userId: action.payload.userId,
            fullName: action.payload.fullName,
            role: action.payload.role,
          })
        );
      }
    },
    autoLogout(state) {
      swal("Phiên đăng nhập đã hết hạn", "Vui lòng đăng nhập lại", "warning");
      state.user = "";
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("currentUser");
    },
    onLogout(state) {
      swal("Đăng xuất thành công", "Bạn đã đăng xuất tài khoản", "success");
      state.user = "";
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("currentUser");
    },
  },
});

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
