import i18n from "i18next"
import { initReactI18next } from "react-i18next"
// User files
// Arabic files
import arAbout from "@/locales/user/ar/about.json";
import arCommon from "@/locales/user/ar/common.json";
import arContact from "@/locales/user/ar/contact.json";
import arHome from "@/locales/user/ar/home.json";
import arProducts from "@/locales/user/ar/products.json";
import arSettings from "@/locales/user/ar/settings.json";
// English files
import enAbout from "@/locales/user/en/about.json";
import enCommon from "@/locales/user/en/common.json";
import enContact from "@/locales/user/en/contact.json";
import enHome from "@/locales/user/en/home.json";
import enProducts from "@/locales/user/en/products.json";
import enSettings from "@/locales/user/en/settings.json";

// ====================================================================
// Admin files

// Arabic files
import arAdminCommon from "@/locales/admin/ar/common.json";
import arAdminDashboard from "@/locales/admin/ar/dashboard.json";
import arAdminProducts from "@/locales/admin/ar/products.json";
import arAdminCategories from "@/locales/admin/ar/categories.json";
import arAdminHeroSlides from "@/locales/admin/ar/heroSlides.json";

// English files
import enAdminCommon from "@/locales/admin/en/common.json";
import enAdminDashboard from "@/locales/admin/en/dashboard.json";
import enAdminProducts from "@/locales/admin/en/products.json";
import enAdminCategories from "@/locales/admin/en/categories.json";
import enAdminHeroSlides from "@/locales/admin/en/heroSlides.json";

const savedLanguage = localStorage.getItem("lang") || "ar"


const resources = {
    ar: {
        about: arAbout,
        common: arCommon,
        contact: arContact,
        home: arHome,
        products: arProducts,
        settings: arSettings,

        adminCommon: arAdminCommon,
        adminDashboard: arAdminDashboard,
        adminProducts: arAdminProducts,
        adminCategories: arAdminCategories,
        adminHeroSlides: arAdminHeroSlides,
    },

    en: {
        about: enAbout,
        common: enCommon,
        contact: enContact,
        home: enHome,
        products: enProducts,
        settings: enSettings,

        adminCommon: enAdminCommon,
        adminDashboard: enAdminDashboard,
        adminProducts: enAdminProducts,
        adminCategories: enAdminCategories,
        adminHeroSlides: enAdminHeroSlides,
    },
}

i18n.use(initReactI18next).init({
    resources,

    lng: savedLanguage,
    fallbackLng: "ar",
    defaultNS: "common",
    interpolation: {
        escapeValue: false,
    },
})

export default i18n;