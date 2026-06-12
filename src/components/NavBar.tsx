import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { memo, useState } from "react";
import diaaLogo from "@/assets/diaa-logo.png";
import { useTranslation } from "react-i18next";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { selectLang } from "@/app/features/language/languageSlice";
import { ShoppingCart } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useGetCategoriesQuery } from "@/app/categories/user/categoryApi";
import type { StrapiCategory } from "@/interfaces";
import { selectCartItems } from "@/app/features/cartSlice";
import { openCartDrawer } from "@/app/features/uiSlice";
import DarkModeToggle from "./ui/DarkModeToggle";
import LanguageToggle from "./ui/LanguageToggle";
import MobileNavbarMenu from "./MobileNavbarMenu";
import { toast } from "sonner";
import { getAuth, removeAuth } from "@/lib/authCookies";
import { Separator } from "./ui/separator";
import { useGetProfileQuery } from "@/app/users/profileApi";
import { DialogDemo } from "./shared/DialogDemo";
import { GoPerson, GoSignOut } from "react-icons/go";

const Navbar = () => {
    const { t } = useTranslation("common");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    const { data } = useGetCategoriesQuery({ lang });
    const cartItems = useAppSelector(selectCartItems);
    const dispatch = useAppDispatch();
    const userLoggedIn = getAuth();
    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useGetProfileQuery(userLoggedIn?.userId);
    const [islogout, setLogout] = useState(false);
    const handleLogout = () => {
        setLogout(true);
        removeAuth();
        localStorage.removeItem("rememberedEmail");
        toast.success(t("logoutMessage"))
    }
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-primary">
                    <img src={diaaLogo} className="w-12 rounded-full" alt="Logo" />
                    {t("appName")}
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 transition-all duration-300">
                    {/* Pages */}
                    <NavigationMenu dir={isRTL ? "rtl" : "ltr"}>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>{t("pages")}</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-primary z-50">
                                    <ul className="w-40">
                                        <li>
                                            <Link to="/" className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                {t("home")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/products" className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                {t("products")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/about" className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                {t("about")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/contact" className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                {t("contact")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/settings" className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                {t("settings")}
                                            </Link>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </ NavigationMenu>

                    {/* Categories */}
                    <NavigationMenu dir={isRTL ? "rtl" : "ltr"}>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>{t("category")}</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-primary z-50">
                                    <ul className="w-40">
                                        {
                                            data?.data?.length ?
                                                <>
                                                    <li>
                                                        <Link to={`/products`} className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                            {t("all")}
                                                        </Link>
                                                    </li>
                                                    {data?.data?.map((cat: StrapiCategory) => {
                                                        return (
                                                            <li key={cat.id}>
                                                                <Link to={`/products?category=${cat.documentId}`} className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                                    {cat.title}
                                                                </Link>
                                                            </li>
                                                        )
                                                    })}
                                                </>
                                                : <div className="text-destructive">{t("categoriesNotFound")}</div>}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </ NavigationMenu>
                    {/* Dark Mode */}
                    <DarkModeToggle />

                    {/* Language */}
                    <LanguageToggle />
                    {/* User Profile */}
                    <div className="flex items-center gap-2">
                        {userLoggedIn?.role === "user" ? (
                            <NavigationMenu dir={isRTL ? "rtl" : "ltr"}>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>
                                            {profileData?.avater?.id ? <img className="w-9 h-9 rounded-full" src={profileData?.avater?.formats?.small?.url} alt={profileData.username} /> :
                                                <Button
                                                    className="
                                                        flex h-8 w-8 items-center justify-center
                                                        rounded-full bg-primary text-md font-bold text-white
                                                    ">
                                                    {profileData?.username?.charAt(0).toUpperCase() || <GoPerson />}
                                                </Button>
                                            }
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="bg-accent z-50">
                                            <ul className="w-50 p-2">
                                                {isProfileLoading || isProfileError ? <p>{isRTL ? "تحميل البيانات..." : "Data loading..."}</p> :
                                                    <>
                                                        <li>
                                                            <p className="text-sm text-muted-foreground">
                                                                {profileData?.email}
                                                            </p>
                                                        </li>
                                                        <Separator className="my-2" />
                                                        <li>
                                                            <Link to="/settings/profile">
                                                                <Button variant={"secondary"} fullWidth className="text-white text-sm mb-2">
                                                                    {t("profile")} <GoPerson />
                                                                </Button>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <DialogDemo loading={islogout} submitButton={t("logout")} onClick={() => handleLogout()} title={`${isRTL ? "هل انت متاكد من تسجيل الخروج!" : "Are you sure you logout!"}`} children={<Button fullWidth variant={"destructive"}>
                                                                {t("logout")} <GoSignOut />
                                                            </Button>} />
                                                        </li></>
                                                }
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        ) : (
                            <NavigationMenu dir={isRTL ? "rtl" : "ltr"}>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>
                                            {t("welcomeBack")} <br />
                                            {t("welcomeBackTitle")}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="bg-accent z-50">
                                            <ul className="w-58">
                                                <li className="flex items-center justify-center">
                                                    <Button variant="link" className="w-fit text-white">
                                                        <Link to="/login">
                                                            {t("login")}
                                                        </Link>
                                                    </Button>
                                                </li>
                                                <li className="flex items-center">
                                                    <p>{t("dontHaveAccount")}</p>
                                                    <Button variant="link" className="w-fit mx-auto text-white">
                                                        <Link to="/register">
                                                            {t("register")}
                                                        </Link>
                                                    </Button>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </ NavigationMenu>
                        )}
                        {/* Actions */}
                        <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => {
                            if (cartItems.length === 0) {
                                toast.info(t("noProducts") + " " + t("inCart"));
                                return;
                            }
                            dispatch(openCartDrawer())
                        }
                        }>
                            {t("cart")}
                            <ShoppingCart size={18} />
                            <span className={`absolute -top-3 text-sm text-primary ${isRTL ? "left-0.5" : "right-0.5"}`}>{cartItems.length}</span>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav */}
                <div className="flex md:hidden">
                    <MobileNavbarMenu />
                </div>
            </div>
        </header >
    );
};

export default memo(Navbar);