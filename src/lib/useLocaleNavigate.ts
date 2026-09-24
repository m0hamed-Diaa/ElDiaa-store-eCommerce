import {
    useNavigate,
    useParams,
} from "react-router-dom";

export function useLocaleNavigate() {

    const navigate = useNavigate();

    const { locale } = useParams();

    return (path: string) =>
        navigate(`/${locale}${path}`, { replace: true });
}