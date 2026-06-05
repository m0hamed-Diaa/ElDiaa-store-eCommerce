import egypt from "../../assets/egypt-flag.png";
import uk from "../../assets/ameica-flag.png";
import { Button } from "./button";
import { selectLang, toggleLanguage } from "@/app/features/language/languageSlice";
import { memo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";


const LanguageToggle = () => {
    const dispatch = useAppDispatch();
    const lang = useAppSelector(selectLang);

    return (
        <Button variant={"secondary"} onClick={() => dispatch(toggleLanguage())}>
            {lang === "ar" ? <span className="flex items-center gap-2"><img className="w-6" src={uk} alt="EN" /> EN</span> : <span className="flex items-center gap-2"><img className="w-6" src={egypt} alt="AR" /> AR</span>}
        </Button>
    );
}

export default memo(LanguageToggle);