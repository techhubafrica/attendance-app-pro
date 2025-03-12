import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  faculties: [],
  faculty: null,
  isLoading: false,
  error: null,
  success: false,
  message: "",
};

export const facultySlice = createSlice({
  name: "faculties",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setFaculties: (state, action) => {
      state.isLoading = false;
      state.faculties = action.payload;
    },
    setFaculty: (state, action) => {
      state.isLoading = false;
      state.faculty = action.payload;
    },
    addFacultySuccess: (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.faculties.push(action.payload);
    },
    updateFacultySuccess: (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.faculties = state.faculties.map((faculty) =>
        faculty._id === action.payload._id ? action.payload : faculty
      );
      if (state.faculty?._id === action.payload._id) {
        state.faculty = action.payload;
      }
    },
    deleteFacultySuccess: (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.faculties = state.faculties.filter(
        (faculty) => faculty._id !== action.payload
      );
      if (state.faculty?._id === action.payload) {
        state.faculty = null;
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
  setFaculties,
  setFaculty,
  addFacultySuccess,
  updateFacultySuccess,
  deleteFacultySuccess,
  setError,
  clearError,
  reset,
} = facultySlice.actions;

export default facultySlice.reducer;
