import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";
import { useEffect } from "react";

export const usePageTitle = (
    arTitle: string,
    enTitle: string
) => {
    const lang = useAppSelector(selectLang);

    useEffect(() => {
        document.title =
            lang === "ar"
                ? arTitle
                : enTitle;
    }, [lang, arTitle, enTitle]);
};