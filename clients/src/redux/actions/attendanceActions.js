import api from "@/utils/server";
import {
  attendanceRequest,
  attendanceSuccess,
  attendanceHistorySuccess,
  getAllAttendanceSuccess,
  getEmployeeAttendanceSuccess,
  attendanceFailure,
  clearAttendanceStatus,
} from "../reducers/attendanceReducer";
import { toast } from "sonner";

// Check-in action
export const checkIn = () => async (dispatch) => {
  try {
    dispatch(attendanceRequest());
    const { data } = await api.post("/attendance/checkin");
    dispatch(attendanceSuccess(data.attendance));
    toast.success("Checked in successfully");
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.msg
        ? error.response.data.msg
        : error.message;
    dispatch(attendanceFailure(message));
    toast.error(message);
    return null;
  }
};

// Check-out action
export const checkOut = () => async (dispatch) => {
  try {
    dispatch(attendanceRequest());
    const { data } = await api.post("/attendance/checkout");
    dispatch(attendanceSuccess(data.attendance));
    toast.success("Checked out successfully");
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.msg
        ? error.response.data.msg
        : error.message;
    dispatch(attendanceFailure(message));
    toast.error(message);
    return null;
  }
};

// Break action
export const takeBreak = () => async (dispatch) => {
  try {
    dispatch(attendanceRequest());
    const { data } = await api.post("/attendance/breaks");
    dispatch(attendanceSuccess(data.attendance));

    // Check if break started or ended
    const lastBreak = data.attendance.breaks[data.attendance.breaks.length - 1];
    const message =
      lastBreak && !lastBreak.end
        ? "Break started successfully"
        : "Break ended successfully";

    toast.success(message);
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.msg
        ? error.response.data.msg
        : error.message;
    dispatch(attendanceFailure(message));
    toast.error(message);
    return null;
  }
};

// Get user attendance history
export const getUserAttendanceHistory =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch(attendanceRequest());

      const { startDate, endDate, page = 1, limit = 10 } = params;
      let url = `/attendance/history?page=${page}&limit=${limit}`;

      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const { data } = await api.get(url);
      dispatch(attendanceHistorySuccess(data));
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch(attendanceFailure(message));
      toast.error(message);
      return null;
    }
  };

// Admin: Get all attendance records
export const getAllAttendance = () => async (dispatch) => {
  try {
    dispatch(attendanceRequest());
    const { data } = await api.get("/attendance");
    dispatch(getAllAttendanceSuccess(data));
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(attendanceFailure(message));
    toast.error(message);
    return null;
  }
};

// Admin: Get employee attendance by period
export const getEmployeeAttendance = (userId, period) => async (dispatch) => {
  try {
    dispatch(attendanceRequest());
    const { data } = await api.get(`/attendance/${userId}/${period}`);
    dispatch(getEmployeeAttendanceSuccess(data));
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(attendanceFailure(message));
    toast.error(message);
    return null;
  }
};

// Clear attendance status
export const clearAttendanceState = () => (dispatch) => {
  dispatch(clearAttendanceStatus());
};
