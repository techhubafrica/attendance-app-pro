import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  labs: [],
  lab: null,
  isLoading: false,
  error: null,
  success: false,
  message: "",
};

export const roboticsLabSlice = createSlice({
  name: "roboticsLabs",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setLabs: (state, action) => {
      state.isLoading = false;
      state.labs = action.payload;
    },
    setLab: (state, action) => {
      state.isLoading = false;
      state.lab = action.payload;
    },
    addLabSuccess: (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.labs.push(action.payload);
    },
    updateLabSuccess: (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.labs = state.labs.map((lab) =>
        lab._id === action.payload._id ? action.payload : lab
      );
      if (state.lab?._id === action.payload._id) {
        state.lab = action.payload;
      }
    },
    deleteLabSuccess: (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.labs = state.labs.filter((lab) => lab._id !== action.payload);
      if (state.lab?._id === action.payload) {
        state.lab = null;
      }
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: (state) => {
      state.isLoading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },
});

export const {
  setLoading,
  setLabs,
  setLab,
  addLabSuccess,
  updateLabSuccess,
  deleteLabSuccess,
  setError,
  clearError,
  reset,
} = roboticsLabSlice.actions;

export default roboticsLabSlice.reducer;
