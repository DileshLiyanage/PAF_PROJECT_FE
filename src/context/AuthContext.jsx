import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Default to USER role for general flow
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('mockUser');
        if (stored) return JSON.parse(stored);
        
        return {
            id: 'USR-101',
            email: 'student@sliit.lk',
            name: 'John Doe',
            role: 'USER'
        };
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('mockUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('mockUser');
        }
    }, [user]);

    // Simple toggle for testing purposes
    const toggleRole = () => {
        if (user.role === 'USER') {
            setUser({
                id: 'ADM-999',
                email: 'admin@sliit.lk',
                name: 'System Admin',
                role: 'ADMIN'
            });
        } else {
            setUser({
                id: 'USR-101',
                email: 'student@sliit.lk',
                name: 'John Doe',
                role: 'USER'
            });
        }
    };

    return (
        <AuthContext.Provider value={{ user, toggleRole, logout: () => setUser(null) }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
