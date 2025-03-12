import api from '@/utils/server';
import {
  setLoading,
  setDepartments,
  setDepartment,
  addDepartmentSuccess,
  updateDepartmentSuccess,
  deleteDepartmentSuccess,
  setError,
} from '../slices/departmentSlice';
import { toast } from 'sonner';

// Get all departments
export const fetchDepartments = () => async (dispatch) => {
  try {
    dispatch(setLoading());   
    const response = await api.get('/departments');
    dispatch(setDepartments(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch departments'));
  }
};
// Add a new department
export const addDepartment = (departmentData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.post('/departments', departmentData);
    dispatch(addDepartmentSuccess(response.data));
    toast.success('Department added successfully');
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to add department'));
    throw error;
  }
};

// Update a department
export const updateDepartment = (id, departmentData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.put(`/departments/${id}`, departmentData);
    dispatch(updateDepartmentSuccess(response.data));
    toast.success('Department updated successfully');
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to update department'));
    throw error;
  }
};

// Delete a department
export const deleteDepartment = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    await api.delete(`/departments/${id}`);
    dispatch(deleteDepartmentSuccess(id));
    toast.success('Department deleted successfully');
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete department'));
    throw error;
  }
};