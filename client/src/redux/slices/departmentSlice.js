import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const initialState = {
  departments: [],
  department: null,
  isLoading: false,
  error: null,
  success: false,
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setDepartments: (state, action) => {
      state.departments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setDepartment: (state, action) => {
      state.department = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addDepartmentSuccess: (state, action) => {
      state.departments.push(action.payload);
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    updateDepartmentSuccess: (state, action) => {
      state.departments = state.departments.map(department => 
        department._id === action.payload._id ? action.payload : department
      );
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    deleteDepartmentSuccess: (state, action) => {
      state.departments = state.departments.filter(department => department._id !== action.payload);
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.success = false;
      toast.error(action.payload || "An error occurred");
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
});

export const {
  setLoading,
  setDepartments,
  setDepartment,
  addDepartmentSuccess,
  updateDepartmentSuccess,
  deleteDepartmentSuccess,
  setError,
  resetSuccess,
} = departmentSlice.actions;

export default departmentSlice.reducer;