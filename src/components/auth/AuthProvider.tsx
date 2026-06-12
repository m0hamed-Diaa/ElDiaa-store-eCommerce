import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getAuth, removeAuth } from "@/lib/authCookies";

interface Props {
    children: React.ReactNode;
}

export default function AuthProvider({
    children,
}: Props) {
    useEffect(() => {
        const auth = getAuth();

        if (!auth?.token) return;

        try {
            const decoded: any = jwtDecode(auth.token);

            const now = Date.now() / 1000;

            if (decoded.exp < now) {
                if (auth.role === "user") {
                    window.location.href = "/login";
                } else {
                    window.location.href = "/admin/login";
                }
                removeAuth();
            }
        } catch {
            removeAuth();
        }
    }, []);

    return <>{children}</>;
}