import React, { useEffect } from "react";
import { createContext } from "react";
import { setCookie } from "nookies"
import Router from "next/router";

import { api } from "../lib/axios";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null | undefined;
    signIn: (data: SignInData) => Promise<void> | string
}

type User = {
    id: number;
    name: string;
    email: string;
    ruleId: number;
}

type SignInData = {
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
    const [user, setUser] = React.useState<User>();
    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInData) {
        try {
            const response = await api.post('/login', { email: email, password: password });
            
            setCookie(undefined, 'jumbo-token', response.data.token, {
                maxAge: 60 * 60 * 1, //1 hora,
            })

            setUser(response.data.userRestruturado);
            api.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;
            console.log('user: ', user);
            Router.push("/admin/products");
        } catch (error) {
            throw new Error("Credenciais inválidas");
        }

    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}
