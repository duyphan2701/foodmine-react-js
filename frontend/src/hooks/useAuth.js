import { useState, createContext, useContext } from 'react';
import * as userService from '../services/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(userService.getUser());

    const login = async (email, password) => {
        try {
            const user = await userService.login(email, password);
            setUser(user);
            toast.success('Login Successful');
        } catch (err) {
            toast.error(err.response.data);
        }
    };

    const register = async data => {
        try {
            const user = await userService.register(data);
            setUser(user);
            toast.success('Register Successful');
        } catch (err) {
            toast.error(err.response.data);
        }
    };

    const logout = () => {
        userService.logout();
        setUser(null);
        toast.success('Logout Successful');
    };

    const updateProfile = async user => {
        const updateUser = await userService.updateProfile(user);
        toast.success('Profile Update Was Successful');
        if (updateUser) setUser(updateUser);
    };

    const changePassword = async passwords => {
        await userService.changePassword(passwords);
        logout();
        toast.success('Password Change Successfully, Please Login Again!');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);