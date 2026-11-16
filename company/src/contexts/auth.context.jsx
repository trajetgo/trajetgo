import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import service from '../services/auth.service';

// 1. Initialize the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Récupération de l'utilisateur (une seule fois au montage)
    const fetchUser = useCallback(async () => {
        try {
            const res = await service.whoami(); // doit inclure credentials
            if (!res.success) throw new Error("Non authentifié");
            const user = res.data;
            setUser(user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);


    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        setUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a Custom Hook for clean consumption
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};