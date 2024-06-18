import { createSlice } from "@reduxjs/toolkit";
import { ROLES } from "../../routes/routes";

const initialState = {
  email: null,
  token: null,
  id: null,
  firstName: null,
  lastName: null,
  role: ROLES.GUEST,
  isLike: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, { payload }) => {
      state.email = payload.email;
      state.token = payload.token;
      state.id = payload.id;
      state.isAuth = payload.isAuth;
      state.role = payload.role;
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
    },

    logout: (state, { payload }) => {
      state.email = null;
      state.token = null;
      state.id = null;
      state.firstName = null;
      state.lastName = null;
      state.role = ROLES.GUEST;

      payload.navigate("/");
    },

    changeIsLike: (state, { payload }) => {
      state.isLike = payload;
    },
  },
});

export const { login, logout, changeIsLike } = authSlice.actions;
