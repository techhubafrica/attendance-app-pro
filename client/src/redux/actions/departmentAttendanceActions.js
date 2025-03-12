import api from '../../utils/server';
import { toast } from 'sonner';
import {
  fetchDepartmentAttendanceStart,
  fetchDepartmentAttendanceSuccess,
  fetchDepartmentAttendanceFailure
} from '../slices/departmentAttendanceSlice';

// Get attendance for all employees in a department
export const getDepartmentAttendance = (departmentId) => async (dispatch) => {
  try {
    dispatch(fetchDepartmentAttendanceStart());
    
    const { data } = await api.get(`/hr/department/${departmentId}`);
    
    dispatch(fetchDepartmentAttendanceSuccess(data));
    return data;
  } catch (error) {
    const message = 
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
        
    console.error('Error fetching department attendance:', message);
    dispatch(fetchDepartmentAttendanceFailure(message));
    toast.error(`Error fetching attendance: ${message}`);
    return null;
  }
};