import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../../../core/api/client';
import { api } from '../services/api';

export type UserRole = 'secretaire' | 'enseignant' | 'admin' | null;

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    teacher_id?: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (access: string, refresh: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    activeModules: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [activeModules, setActiveModules] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const data = await api.get('/auth/me/');
            setUser(data);
            try {
                const modules = await apiClient.get<any[]>('/core/identity/modules/');
                setActiveModules(modules.map(m => m.id));
            } catch(e) {
                // Fallback si l'endpoint n'est pas dispo
                setActiveModules(['education', 'library']);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du profil utilisateur', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (access: string, refresh: string) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        await fetchUser();
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user, activeModules }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé au sein d\'un AuthProvider');
    }
    return context;
};
