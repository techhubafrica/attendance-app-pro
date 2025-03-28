import api from '@/utils/server';
import {
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
} from '../slices/employeeSlice';
import { toast } from 'sonner';

// Get all employees
export const fetchEmployees = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.get('/employees');
    dispatch(setEmployees(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch employees';
    dispatch(setError(message));
    toast.error(message);
    throw error;
  }
};

// Get a single employee by ID
export const fetchEmployeeById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await api.get(`/employees/${id}`);
    dispatch(setEmployee(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch employee details';
    dispatch(setError(message));
    toast.error(message);
    throw error;
  }
};

// Get all users who can be employees
export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await api.get('/employees/users');
    dispatch(setUsers(response.data.employees)); // Update Redux state
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch users';
    dispatch(setError(message));
    toast.error(message);
    throw error;
  }
};

// Add a new employee
export const addEmployee = (employeeData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.post('/employees', employeeData);
    dispatch(addEmployeeSuccess(response.data));
    toast.success('Employee added successfully');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add employee';
    dispatch(setError(message));
    toast.error(message);
    throw error;
  }
};

// Update an employee
export const updateEmployee = (id, employeeData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.put(`/employees/${id}`, employeeData);
    dispatch(updateEmployeeSuccess(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update employee';
    dispatch(setError(message));
    toast.error(message);
    throw error;
  }
};

// Delete an employee
export const deleteEmployee = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    await api.delete(`/employees/${id}`);
    dispatch(deleteEmployeeSuccess(id));
    return id;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete employee';
    dispatch(setError(message));
    toast.error(message);
    throw error;
  }
};
