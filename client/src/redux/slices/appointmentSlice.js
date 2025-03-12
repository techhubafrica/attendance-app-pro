import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  userAppointments: [],
  appointment: null,
  faculties: [],
  labs: [],
  isLoading: false,
  error: null,
  success: false,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setAppointments: (state, action) => {
      state.appointments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUserAppointments: (state, action) => {
      state.userAppointments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setAppointment: (state, action) => {
      state.appointment = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setFaculties: (state, action) => {
      state.faculties = action.payload;
      state.isLoading = false;
    },
    setLabs: (state, action) => {
      state.labs = action.payload;
      state.isLoading = false;
    },
    appointmentError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    appointmentSuccess: (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    clearAppointmentState: (state) => {
      state.appointment = null;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setAppointments,
  setUserAppointments,
  setAppointment,
  setFaculties,
  setLabs,
  appointmentError,
  appointmentSuccess,
  clearAppointmentState,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;