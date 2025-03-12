
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import attendanceReducer from './reducers/attendanceReducer';
import employeeReducer from "./slices/employeeSlice"
import companyReducer from './slices/companySlice';
import departmentReducer from './slices/departmentSlice';
import regionReducer from './slices/regionSlice';
import bookReducer from './slices/bookSlice';
import roboticsLabReducer from './slices/roboticsLabSlice';
import facultyReducer from './slices/facultySlice';
import appointmentReducer from './reducers/appointmentReducer';
import departmentAttendanceReducer from './slices/departmentAttendanceSlice';
import notificationReducer from './slices/notificationSlice';



export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    employees: employeeReducer,
    companies: companyReducer,
    departments: departmentReducer,
    regions: regionReducer,
    books: bookReducer,
    appointments: appointmentReducer,
    roboticsLabs: roboticsLabReducer,
    faculties: facultyReducer,
    departmentAttendance: departmentAttendanceReducer,
    notifications: notificationReducer
  },
  devTools: true,
});

export default store;
