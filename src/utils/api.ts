import axios from 'axios';
import { Platform } from 'react-native';

import { getUserSession } from './storage';

// Use 10.0.2.2 for Android Emulator to access host machine's localhost
// Use localhost for iOS Simulator
// For physical devices, you must use your machine's IP address (e.g., 192.168.x.x)
export const BASE_API = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5000/api/' 
  : 'http://localhost:5000/api/';

export const USER_BASE_URL = `${BASE_API}user`;
export const DOCTOR_BASE_URL = `${BASE_API}doctor`;

console.log('API Base URL:', BASE_API);

const apiClient = axios.create({
  baseURL: BASE_API,
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
      throw new Error('Network error. Check if your backend is running at ' + BASE_API);
    } else {
      // Something happened in setting up the request
      console.error(`Request Setup Error (${endpoint}):`, error.message);
      throw error;
    }
  }
};

// Auth Services
export const registerUser = (userData: any) => apiCall('user/register', 'POST', userData);
export const loginUser = (credentials: any) => apiCall('user/login', 'POST', credentials);

/**
 * Checks if a user exists in the database.
 * Hits /login with only the identifier (phone or email).
 */
export const checkUserExistence = (identifier: string) => {
  const isEmail = identifier.includes('@');
  return apiCall('user/login', 'POST', isEmail ? { email: identifier.trim() } : { phone: identifier.trim() });
};

export const sendOtp = (payload: { phone?: string; email?: string }) => apiCall('user/send-otp', 'POST', payload);
export const verifyOtp = (payload: { phone?: string; email?: string; otp: string }) => apiCall('user/verify-otp', 'POST', payload);

// Patient Profile Services
export const getPatientProfile = () => apiCall('patient/get-profile', 'GET');
export const savePatientProfile = (profileData: any) => apiCall('patient/save-profile', 'POST', profileData);
export const updatePatientProfile = (profileData: any) => apiCall('patient/update-profile', 'POST', profileData);

// Doctor Profile Services
export const getDoctorProfile = () => apiCall('doctor/get-profile', 'GET');
export const saveDoctorProfile = (profileData: any) => apiCall('doctor/save-profile', 'POST', profileData);
export const updateDoctorProfile = (profileData: any) => apiCall('doctor/update-profile', 'POST', profileData);

