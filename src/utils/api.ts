import axios from 'axios';
import { Platform } from 'react-native';

import { getUserSession } from './storage';

// Use 10.0.2.2 for Android Emulator to access host machine's localhost
// Use localhost for iOS Simulator
// For physical devices, you must use your machine's IP address (e.g., 192.168.x.x)
export const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5000/api/user' 
  : 'http://localhost:5000/api/user';

console.log('API Base URL:', BASE_URL);

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

export const apiCall = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) => {
  try {
    const session = await getUserSession();
    const token = session?.token || session?.data?.token;

    console.log(`Making ${method} request to: ${BASE_URL}${endpoint}`);
    if (body) console.log('Request Body:', JSON.stringify(body, null, 2));

    const response = await apiClient({
      url: endpoint,
      method,
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    
    console.log(`Response from ${endpoint}:`, response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error(`API Error (${endpoint}):`, error.response.status, error.response.data);
      throw new Error(error.response.data.message || error.response.data.error || 'Server error');
    } else if (error.request) {
      // Request was made but no response was received
      console.error(`Network Error (${endpoint}): No response received.`, error.message);
      throw new Error('Network error. Check if your backend is running at ' + BASE_URL);
    } else {
      // Something happened in setting up the request
      console.error(`Request Setup Error (${endpoint}):`, error.message);
      throw error;
    }
  }
};

// Auth Services
export const registerUser = (userData: any) => apiCall('/register', 'POST', userData);
export const loginUser = (credentials: any) => apiCall('/login', 'POST', credentials);

/**
 * Checks if a user exists in the database.
 * Hits /login with only the identifier (phone or email).
 */
export const checkUserExistence = (identifier: string) => {
  const isEmail = identifier.includes('@');
  return apiCall('/login', 'POST', isEmail ? { email: identifier.trim() } : { phone: identifier.trim() });
};

export const sendOtp = (payload: { phone?: string; email?: string }) => apiCall('/send-otp', 'POST', payload);
export const verifyOtp = (payload: { phone?: string; email?: string; otp: string }) => apiCall('/verify-otp', 'POST', payload);

// Patient Profile Services
export const getPatientProfile = () => apiCall('/get-profile', 'GET');
export const savePatientProfile = (profileData: any) => apiCall('/save-profile', 'POST', profileData);
export const updatePatientProfile = (profileData: any) => apiCall('/update-profile', 'POST', profileData);

