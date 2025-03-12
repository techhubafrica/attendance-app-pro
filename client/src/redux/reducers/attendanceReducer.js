import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentAttendance: null,
  attendanceHistory: [],
  loading: false,
  error: null,
  success: false,
  totalPages: 0,
  currentPage: 1,
  totalCount: 0,
  employeeAttendance: []
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    attendanceRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    attendanceSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.currentAttendance = action.payload;
    },
    attendanceHistorySuccess: (state, action) => {
      state.loading = false;
      state.attendanceHistory = action.payload.attendance;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.totalCount = action.payload.totalCount;
    },
    getAllAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.employeeAttendance = action.payload.attendanceRecords;
    },
    getEmployeeAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.employeeAttendance = action.payload.attendanceRecords;
    },
    attendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearAttendanceStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    resetAttendance: (state) => {
      return initialState;
    }
  }
});

export const {
  attendanceRequest,
  attendanceSuccess,
  attendanceHistorySuccess,
  getAllAttendanceSuccess,
  getEmployeeAttendanceSuccess,
  attendanceFailure,
  clearAttendanceStatus,
  resetAttendance
} = attendanceSlice.actions;

export default attendanceSlice.reducer;