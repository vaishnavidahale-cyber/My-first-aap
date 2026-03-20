import axios from 'axios';

const API_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const logout = async () => {
    try {
        await axios.post(`${API_URL}/logout`);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Logout failed');
    }
};