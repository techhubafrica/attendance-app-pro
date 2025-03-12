
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const initialState = {
  companies: [],
  company: null,
  isLoading: false,
  error: null,
  success: false,
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCompany: (state, action) => {
      state.company = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addCompanySuccess: (state, action) => {
      state.companies.push(action.payload);
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    updateCompanySuccess: (state, action) => {
      state.companies = state.companies.map(company => 
        company._id === action.payload._id ? action.payload : company
      );
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    deleteCompanySuccess: (state, action) => {
      state.companies = state.companies.filter(company => company._id !== action.payload);
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
  setCompanies,
  setCompany,
  addCompanySuccess,
  updateCompanySuccess,
  deleteCompanySuccess,
  setError,
  resetSuccess,
} = companySlice.actions;

export default companySlice.reducer;