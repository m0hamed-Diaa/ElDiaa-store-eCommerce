import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { getAuth, removeAuth } from "@/lib/authCookies";
import { SessionExpiredDialog } from "@/components/SessionExpiredDialog";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sessionExpired, setSessionExpired] =
        useState(false);
    const [user, setUser] =
        useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const auth = getAuth();

            if (!auth?.token) return;

            const logoutPath =
                auth.role === "admin"
                    ? "/admin/login"
                    : "/login";

            try {
                const decoded: any =
                    jwtDecode(auth.token);

                if (
                    decoded.exp * 1000 <=
                    Date.now()
                ) {
                    clearInterval(interval);

                    removeAuth();
                    setUser(logoutPath);
                    setSessionExpired(true);
                }
            } catch {
                removeAuth();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {children}

            <SessionExpiredDialog
                type={user}
                open={sessionExpired}
            />
        </>
    );
}