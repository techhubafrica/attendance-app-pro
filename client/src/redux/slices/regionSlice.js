import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const initialState = {
  regions: [],
  region: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  },
  isLoading: false,
  error: null,
  success: false,
};

const regionSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setRegions: (state, action) => {
      state.regions = action.payload.regions;
      state.pagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalItems: action.payload.totalItems
      };
      state.isLoading = false;
      state.error = null;
    },
    setRegion: (state, action) => {
      state.region = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addRegionSuccess: (state, action) => {
      state.regions.unshift(action.payload);
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    updateRegionSuccess: (state, action) => {
      state.regions = state.regions.map(region => 
        region._id === action.payload._id ? action.payload : region
      );
      if (state.region && state.region._id === action.payload._id) {
        state.region = action.payload;
      }
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    deleteRegionSuccess: (state, action) => {
      state.regions = state.regions.filter(region => region._id !== action.payload);
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
  setRegions,
  setRegion,
  addRegionSuccess,
  updateRegionSuccess,
  deleteRegionSuccess,
  setError,
  resetSuccess,
} = regionSlice.actions;

export default regionSlice.reducer;