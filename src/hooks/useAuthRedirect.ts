import { useLocation } from "react-router-dom";

export const useAuthRedirect = () => {
    const location = useLocation();

    const saveCurrentPage = () => {
        sessionStorage.setItem(
            "redirectAfterAuth",
            location.pathname + location.search
        );
    };

    return { saveCurrentPage };
};