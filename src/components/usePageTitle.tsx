import { useLocale } from "@/lib/useLocale";
import { useEffect } from "react";

export const usePageTitle = (
    arTitle: string,
    enTitle: string
) => {
    const { lang } = useLocale();
    useEffect(() => {
        document.title =
            lang === "ar"
                ? arTitle
                : enTitle;
    }, [lang, arTitle, enTitle]);
};