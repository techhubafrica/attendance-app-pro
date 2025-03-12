import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  employee: null,
  users: [],
  departments: [],
  companies: [],
  isLoading: false,
  error: null,
  success: false,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setEmployee: (state, action) => {
      state.employee = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setDepartments: (state, action) => {
      state.departments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addEmployeeSuccess: (state, action) => {
      state.employees.push(action.payload);
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    updateEmployeeSuccess: (state, action) => {
      state.employees = state.employees.map(employee => 
        employee._id === action.payload._id ? action.payload : employee
      );
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    deleteEmployeeSuccess: (state, action) => {
      state.employees = state.employees.filter(employee => employee._id !== action.payload);
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.success = false;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
});

export const {
  setLoading,
  setEmployees,
  setEmployee,
  setUsers,
  setDepartments,
  setCompanies,
  addEmployeeSuccess,
  updateEmployeeSuccess,
  deleteEmployeeSuccess,
  setError,
  resetSuccess,
} = employeeSlice.actions;

export default employeeSlice.reducer;