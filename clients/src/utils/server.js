import axios from "axios";

const baseURL = "http://localhost:3000/api";
// const baseURL = "https://attendance-app-pro.onrender.com/api";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Handle content type
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

export default api;
