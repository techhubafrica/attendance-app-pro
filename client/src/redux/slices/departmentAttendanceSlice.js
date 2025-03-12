import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  departmentAttendance: [],
  loading: false,
  error: null
};

const departmentAttendanceSlice = createSlice({
  name: 'departmentAttendance',
  initialState,
  reducers: {
    fetchDepartmentAttendanceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDepartmentAttendanceSuccess: (state, action) => {
      state.departmentAttendance = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchDepartmentAttendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchDepartmentAttendanceStart,
  fetchDepartmentAttendanceSuccess,
  fetchDepartmentAttendanceFailure
} = departmentAttendanceSlice.actions;

export default departmentAttendanceSlice.reducer;