import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import i18n from "@/lib/i18n";
import { setDirection } from "@/lib/direction";

export function useLocale() {
    const { locale = "ar" } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const lang = useMemo<"ar" | "en">(() => {
        return locale === "en" ? "en" : "ar";
    }, [locale]);

    const isRTL = lang === "ar";

    useEffect(() => {
        i18n.changeLanguage(lang);
        setDirection(lang);
        localStorage.setItem("lang", lang);
    }, [lang]);

    const changeLanguage = (newLang: "ar" | "en") => {
        navigate(
            location.pathname.replace(
                /^\/(ar|en)/,
                `/${newLang}`
            )
        );
    };

    return {
        lang,
        isRTL,
        changeLanguage,
    };
}