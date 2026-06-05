import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { setDirection } from "@/lib/direction";
import i18n from "@/lib/i18n";

type Language = "ar" | "en";

const savedLang =
    (localStorage.getItem("lang") as Language) || "ar";

setDirection(savedLang);

const languageSlice = createSlice({
    name: "language",

    initialState: {
        lang: savedLang,
    },

    reducers: {
        toggleLanguage: (state) => {
            state.lang = state.lang === "ar" ? "en" : "ar";

            localStorage.setItem("lang", state.lang);

            setDirection(state.lang);   // change direction (rtl | ltr)
            i18n.changeLanguage(state.lang); // change language
        },
    },
});

export const { toggleLanguage } =
    languageSlice.actions;

export const selectLang = (state: RootState) => state.language.lang;

export default languageSlice.reducer;