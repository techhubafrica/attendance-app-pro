import api from "@/utils/server";
import {
  setLoading,
  setLabs,
  setLab,
  addLabSuccess,
  updateLabSuccess,
  deleteLabSuccess,
  setError,
} from "../slices/roboticsLabSlice";
import { toast } from "sonner";

// Get all robotics labs
export const fetchRoboticsLabs = () => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await api.get("/robotics-labs");
    dispatch(setLabs(response.data));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch robotics labs")
    );
  }
};

// Get a single robotics lab
export const fetchRoboticsLabById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await api.get(`/robotics-labs/${id}`);
    dispatch(setLab(response.data));
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message || "Failed to fetch robotics lab details"
      )
    );
  }
};

// Add a new robotics lab
export const addRoboticsLab = (labData) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await api.post("/robotics-labs/create", labData);
    dispatch(addLabSuccess(response.data));
    toast.success("Robotics lab added successfully");
    return response.data;
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to add robotics lab")
    );
    toast.error(error.response?.data?.message || "Failed to add robotics lab");
    throw error;
  }
};

// Update a robotics lab
export const updateRoboticsLab = (id, labData) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await api.put(`/robotics-labs/${id}`, labData);
    dispatch(updateLabSuccess(response.data));
    toast.success("Robotics lab updated successfully");
    return response.data;
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to update robotics lab")
    );
    toast.error(
      error.response?.data?.message || "Failed to update robotics lab"
    );
    throw error;
  }
};

// Delete a robotics lab
export const deleteRoboticsLab = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());

    await api.delete(`/robotics-labs/${id}`);
    dispatch(deleteLabSuccess(id));
    toast.success("Robotics lab deleted successfully");
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to delete robotics lab")
    );
    toast.error(
      error.response?.data?.message || "Failed to delete robotics lab"
    );
    throw error;
  }
};
