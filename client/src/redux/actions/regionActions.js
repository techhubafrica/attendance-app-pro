import api from '@/utils/server';
import {
  setLoading,
  setRegions,
  setRegion,
  addRegionSuccess,
  updateRegionSuccess,
  deleteRegionSuccess,
  setError,
} from '../slices/regionSlice';
import { toast } from 'sonner';

// Get all regions with pagination
export const fetchRegions = (page = 1, limit = 20) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.get(`/regions?page=${page}&limit=${limit}`);
    dispatch(setRegions(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch regions'));
  }
};

// Get a single region
export const fetchRegionById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.get(`/regions/${id}`);
    dispatch(setRegion(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch region details'));
  }
};

// Add a new region
export const addRegion = (regionData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.post('/regions/create', regionData);
    dispatch(addRegionSuccess(response.data));
    toast.success('Region added successfully');
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to add region'));
    throw error;
  }
};

// Update a region
export const updateRegion = (id, regionData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.put(`/regions/${id}`, regionData);
    dispatch(updateRegionSuccess(response.data.region));
    toast.success('Region updated successfully');
    return response.data.region;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to update region'));
    throw error;
  }
};

// Delete a region
export const deleteRegion = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    await api.delete(`/regions/${id}`);
    dispatch(deleteRegionSuccess(id));
    toast.success('Region deleted successfully');
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete region'));
    throw error;
  }
};