// This file re-exports everything from the actions and reducer for backward compatibility
import * as attendanceActions from '../actions/attendanceActions';
import attendanceReducer, {
  attendanceRequest,
  attendanceSuccess,
  attendanceHistorySuccess,
  getAllAttendanceSuccess,
  getEmployeeAttendanceSuccess,
  attendanceFailure,
  clearAttendanceStatus,
  resetAttendance
} from '../reducers/attendanceReducer';

// Re-export all the actions
export const {
  checkIn,
  checkOut,
  takeBreak,
  getUserAttendanceHistory,
  getAllAttendance,
  getEmployeeAttendance,
  clearAttendanceState
} = attendanceActions;

// Re-export the reducer actions
export {
  attendanceRequest,
  attendanceSuccess,
  attendanceHistorySuccess,
  getAllAttendanceSuccess,
  getEmployeeAttendanceSuccess,
  attendanceFailure,
  clearAttendanceStatus,
  resetAttendance
};

// Export the reducer as default
export default attendanceReducer;