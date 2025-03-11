
import api from '@/utils/server';
import {
  setLoading,
  setCompanies,
  setCompany,
  addCompanySuccess,
  updateCompanySuccess,
  deleteCompanySuccess,
  setError,
} from '../slices/companySlice';
import { toast } from 'sonner';

// Get all companies
export const fetchCompanies = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.get('/companies');
    dispatch(setCompanies(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch companies'));
  }
};

// Get a single company
export const fetchCompanyById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.get(`/companies/${id}`);
    dispatch(setCompany(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch company details'));
  }
};

// create a new company
export const addCompany = (companyData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.post('/companies', companyData);
    dispatch(addCompanySuccess(response.data));
    toast.success('Company added successfully');
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to add company'));
    throw error;
  }
};
// Update a company
export const updateCompany = (id, companyData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.put(`/companies/${id}`, companyData);
    dispatch(updateCompanySuccess(response.data.updatedCompany)); // Fix the key
    toast.success('Company updated successfully');
    return response.data.updatedCompany; // Fix return value
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Failed to update company';
    dispatch(setError(errorMsg));
    toast.error(errorMsg); // Show error toast
    throw error;
  }
};
// Delete a company
export const deleteCompany = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    await api.delete(`/companies/${id}`);
    dispatch(deleteCompanySuccess(id));
    toast.success('Company deleted successfully');
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete company'));
    throw error;
  }
};