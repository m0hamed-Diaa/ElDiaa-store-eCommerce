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
                removeAuth();
                window.location.href = "/login";
            }
        } catch {
            removeAuth();
        }
    }, []);

    return <>{children}</>;
}