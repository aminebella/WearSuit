import axios from 'axios';

// Base URL of Laravel API.
// export const API_BASE_URL = 'http://10.14.197.67:8000/api'; // IMPORTANT: I use My machine Wirless IP v4 when testing on my real phone using expo so the app in phone can enter my backend using this api.
export const API_BASE_URL = 'http://192.168.1.5:8000/api'; // IMPORTANT: I use My machine Wirless IP v4 when testing on my real phone using expo so the app in phone can enter my backend using this api.

// Useful for building image URLs (Laravel serves images under /storage/...)
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // if the backend don't response after 15s it fails
  // For React Native + Sanctum personal access tokens, we do NOT need cookies/CSRF.
  // We authenticate via Authorization: Bearer <token>.
});

// Add token automatically to all requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ---------------------------------------------------------------------------
// AUTH (Backend Via auth:sanctum):
// Login : POST /login
export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  // returns: { message, token, user }
  return response.data;
};

// Register: POST /register 
export const register = async (data) => {
  const response = await api.post('/register', data);
  // returns: { message, user }
  return response.data;
};

// Logout: POST /logout
export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

// ---------------------------------------------------------------------------
// CLIENT (Via auth:sanctum) , Protected needed Bearer token (using setAuthToken)
// Suit Part
// Suits Filters: GET /filters
export const getFilters = async () => {
  const response = await api.get('/filters');
  return response.data;
};

// List of suits: GET /suits
export const getSuits = async (params = {}) => {
  const response = await api.get('/suits', { params });
  return response.data;
};

// Suit details: GET /suits/id
export const getSuitDetails = async (suitId) => {
  const response = await api.get(`/suits/${suitId}`);
  return response.data;
};

// Suit availability: GET /suits/id/availability
export const getSuitAvailability = async (suitId) => {
  const response = await api.get(`/suits/${suitId}/availability`);
  return response.data;
};

// Reservation Part
// Client reservation : GET /my-rentals
export const getMyRentals = async (params = {}) => {
  const response = await api.get('/my-rentals', { params });
  return response.data;
};

// rental Details: GET /rentals/id
export const getRentalDetails = async (rentalId) => {
  const response = await api.get(`/rentals/${rentalId}`);
  return response.data;
};

// ---------------------------------------------------------------------------
// ADMIN (auth:sanctum + middleware: is_admin (/admin prefix))

// List admin Suits (suits owned by the admin(suits created by admin))
export const getAdminSuits = async (params = {}) => {
  const response = await api.get('/admin/suits', { params });
  return response.data;
};

// create new Suit : POST /admin/suits
export const createAdminSuit = async (data) => {
  const response = await api.post('/admin/suits', data);
  return response.data;
};

// Update Suit : PUT /admin/suits
export const updateAdminSuit = async (suitId, data) => {
  const response = await api.put(`/admin/suits/${suitId}`, data);
  return response.data;
};

// Delete Suit : DELETE /admin/suits/Id
export const deleteAdminSuit = async (suitId) => {
  const response = await api.delete(`/admin/suits/${suitId}`);
  return response.data;
};

// Suit images
// Add image to a suit
export const uploadSuitImages = async (suitId, formData) => {
  const response = await api.post(`/admin/suits/${suitId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// delete image to a suit
export const deleteSuitImage = async (suitId, imageId) => {
  const response = await api.delete(`/admin/suits/${suitId}/images/${imageId}`);
  return response.data;
};

// Rentals (reservations)
// List of reservation of admin suits
export const getAdminRentals = async (params = {}) => {
  const response = await api.get('/admin/rentals', { params });
  return response.data;
};

// Create reservation of admin suits
export const createAdminRental = async (data) => {
  const response = await api.post('/admin/rentals', data);
  return response.data;
};

// Update reservation of admin suits
export const updateAdminRental = async (rentalId, data) => {
  const response = await api.put(`/admin/rentals/${rentalId}`, data);
  return response.data;
};

// Delete reservation of admin suits
export const deleteAdminRental = async (rentalId) => {
  const response = await api.delete(`/admin/rentals/${rentalId}`);
  return response.data;
};

// List of client users (for reservation creation)
export const getAdminUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

// ---------------------------------------------------------------------------
// STUBS (Backend endpoints not found in routes/api.php)

// Admin needs to pick a client user from a list when creating reservations.
  // NO route Implemented yet : GET /users in backend/routes/api.php.
export const getUsersForAdmin = async () => {
  const response = await api.get(`/users`);
  return response.data;
};

export default api;
