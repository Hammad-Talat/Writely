import { createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("writely_auth") || "null");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: saved?.user || null,
    access: saved?.access || "",
    refresh: saved?.refresh || "",
  },
  reducers: {
    setAuth: (state, { payload }) => {
      state.user = payload.user;
      state.access = payload.access;
      state.refresh = payload.refresh;
      localStorage.setItem("writely_auth", JSON.stringify(payload));
    },
    logout: (state) => {
      state.user = null;
      state.access = "";
      state.refresh = "";
      localStorage.removeItem("writely_auth");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
