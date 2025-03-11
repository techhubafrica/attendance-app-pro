import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  userAppointments: [],
  appointment: null,
  isLoading: false,
  error: null,
  success: false,
  message: '',
};

const appointmentReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('appointments/setLoading', (state, action) => {
      state.isLoading = action.payload;
    })
    .addCase('appointments/appointmentError', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase('appointments/createAppointmentSuccess', (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.userAppointments.push(action.payload);
    })
    .addCase('appointments/getAllAppointmentsSuccess', (state, action) => {
      state.isLoading = false;
      state.appointments = action.payload;
    })
    .addCase('appointments/getUserAppointmentsSuccess', (state, action) => {
      state.isLoading = false;
      state.userAppointments = action.payload;
    })
    .addCase('appointments/getAppointmentSuccess', (state, action) => {
      state.isLoading = false;
      state.appointment = action.payload;
    })
    .addCase('appointments/approveAppointmentSuccess', (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.appointments = state.appointments.map(appointment => 
        appointment._id === action.payload._id ? action.payload : appointment
      );
      state.userAppointments = state.userAppointments.map(appointment => 
        appointment._id === action.payload._id ? action.payload : appointment
      );
      if (state.appointment?._id === action.payload._id) {
        state.appointment = action.payload;
      }
    })
    .addCase('appointments/checkInAppointmentSuccess', (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.userAppointments = state.userAppointments.map(appointment => 
        appointment._id === action.payload._id ? action.payload : appointment
      );
      if (state.appointment?._id === action.payload._id) {
        state.appointment = action.payload;
      }
    })
    .addCase('appointments/checkOutAppointmentSuccess', (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.userAppointments = state.userAppointments.map(appointment => 
        appointment._id === action.payload._id ? action.payload : appointment
      );
      if (state.appointment?._id === action.payload._id) {
        state.appointment = action.payload;
      }
    });
});

export default appointmentReducer;
