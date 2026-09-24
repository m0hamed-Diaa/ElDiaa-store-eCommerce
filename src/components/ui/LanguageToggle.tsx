import egypt from "../../assets/egypt-flag.png";
import uk from "../../assets/ameica-flag.png";
import { Button } from "./button";
import { memo } from "react";
import { useLocale } from "@/lib/useLocale";


const LanguageToggle = () => {
    const {
        lang, changeLanguage } = useLocale();
    return (
        <Button variant={"secondary"} onClick={() =>
            changeLanguage(lang === "ar" ? "en" : "ar")}>
            {lang === "ar" ? <span className="flex items-center gap-2"><img className="w-6" src={uk} alt="EN" /> EN</span> : <span className="flex items-center gap-2"><img className="w-6" src={egypt} alt="AR" /> AR</span>}
        </Button>
    );
}

export default memo(LanguageToggle);