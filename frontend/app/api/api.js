import axios from "axios";

const api  = axios.create({
  // baseURL: "http://127.0.0.1:8000/api",
  // baseURL: "http://10.65.35.67:8000/api",
  baseURL: "http://192.168.1.5:8000/api",
  timeout: 5000,
  withCredentials: true,
});

// Add token automatically to all requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// AUTH
export const login = async (email, password) => {
  const response = await api.post("/login", {
    email,
    password,
  });
  return response.data;
};

export const register = async (data) => {
  return api.post("/register", data);
};

export const logout = async () => {
  return api.post("/logout");
};

// SUITS CRUD
export const getSuits = async () => {
  const response = await api.get("/suits");
  return response.data;
};

export const getSuit = async (id) => {
  return api.get(`/suit/${id}`);
};

export const createSuit = async (data) => {
  return api.post("/suits", data);
};

export const updateSuit = async (id, data) => {
  return api.put(`/suits/${id}`, data);
};

export const deleteSuit = async (id) => {
  return api.delete(`/suits/${id}`);
};

// RENTALS
export const getRentals = async () => {
  return api.get("/rentals");
};


export default api;
