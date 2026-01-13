export const BASE_URL = 'http://10.0.2.2:5000/api/user'; // Use 10.0.2.2 for Android Emulator

export const apiCall = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) => {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error: any) {
    console.error(`API Call Error (${endpoint}):`, error);
    throw error;
  }
};

// Auth Services
export const registerUser = (userData: any) => apiCall('/register', 'POST', userData);
export const loginUser = (credentials: any) => apiCall('/login', 'POST', credentials);
export const sendOtp = (payload: { phone?: string; email?: string }) => apiCall('/send-otp', 'POST', payload);
export const verifyOtp = (payload: { phone?: string; email?: string; otp: string }) => apiCall('/verify-otp', 'POST', payload);
