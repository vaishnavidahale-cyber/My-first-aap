import { useEffect, useState } from 'react';
import { login as loginService, logout as logoutService } from '../services/authService';

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthResponse {
    user: User;
    token: string;
}

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: AuthResponse = await loginService(username, password);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
        } catch (err: any) {
            setError(err?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutService();
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } catch (err: any) {
            setError(err?.message || 'Logout failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Logic to check if user is already authenticated (e.g., check local storage or a cookie)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    return { user, loading, error, login, logout };
};

export default useAuth;
export { useAuth };
