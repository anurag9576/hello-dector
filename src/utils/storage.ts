import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@user_data';

export const saveUserSession = async (userData: any) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving user session:', e);
  }
};

export const getUserSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting user session:', e);
    return null;
  }
};

export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Error clearing user session:', e);
  }
};
