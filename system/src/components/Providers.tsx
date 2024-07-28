'use client'

import React, { PropsWithChildren, createContext, useContext } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { User } from "@prisma/client";

export default function Providers({
    children,
    user,
}: { user: User } & PropsWithChildren) {
    return (
        <NextUIProvider>
            <AuthProvider user={user}>{children}</AuthProvider>
        </NextUIProvider>
    );
}

export const AuthContext = createContext<User | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({
    children,
    user,
}: { user: User } & PropsWithChildren) {
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
