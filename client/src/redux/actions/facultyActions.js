import api from "@/utils/server";
import {
  setLoading,
  setFaculties,
  setFaculty,
  addFacultySuccess,
  updateFacultySuccess,
  deleteFacultySuccess,
  setError,
} from "../slices/facultySlice";
import { toast } from "sonner";

// Get all faculties
export const fetchFaculties = () => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await api.get("/faculties");
    dispatch(setFaculties(response.data));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch faculties")
    );
  }
};

// Get a single faculty
export const fetchFacultyById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await api.get(`/faculties/${id}`);
    dispatch(setFaculty(response.data));
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message || "Failed to fetch faculty details"
      )
    );
  }
};

// Add a new faculty
export const addFaculty = (facultyData) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await api.post("/faculties", facultyData);
    dispatch(addFacultySuccess(response.data));
    toast.success("Faculty added successfully");
    return response.data;
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to add faculty")
    );
    toast.error(error.response?.data?.message || "Failed to add faculty");
    throw error;
  }
};

// Update a faculty
export const updateFaculty = (id, facultyData) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await api.put(`/faculties/${id}`, facultyData);
    dispatch(updateFacultySuccess(response.data));
    toast.success("Faculty updated successfully");
    return response.data;
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to update faculty")
    );
    toast.error(error.response?.data?.message || "Failed to update faculty");
    throw error;
  }
};

// Delete a faculty
export const deleteFaculty = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());

    await api.delete(`/faculties/${id}`);
    dispatch(deleteFacultySuccess(id));
    toast.success("Faculty deleted successfully");
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to delete faculty")
    );
    toast.error(error.response?.data?.message || "Failed to delete faculty");
    throw error;
  }
};
