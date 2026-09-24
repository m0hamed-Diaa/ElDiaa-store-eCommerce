import { memo } from "react";
import diaaLogo from "@/assets/diaa-logo.png";
import { useTranslation } from "react-i18next";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
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
import UserProfileIcon from "./UserProfileIcon";
import { useLocale } from "@/lib/useLocale";
import { AppLink } from "./paths/AppLink";

const Navbar = () => {
    const { t } = useTranslation("common");
    const { isRTL, lang } = useLocale();
    const { data } = useGetCategoriesQuery({ lang });
    const cartItems = useAppSelector(selectCartItems);
    const dispatch = useAppDispatch();
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                {/* Logo */}
                <AppLink to="/" className="flex items-center gap-2 text-primary">
                    <img src={diaaLogo} className="w-12 rounded-full" alt="Logo" />
                    {t("appName")}
                </AppLink>

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
                                            <AppLink to="/" className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                {t("home")}
                                            </AppLink>
                                        </li>
                                        <li>
                                            <AppLink to="/products" className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                {t("products")}
                                            </AppLink>
                                        </li>
                                        <li>
                                            <AppLink to="/about" className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                {t("about")}
                                            </AppLink>
                                        </li>
                                        <li>
                                            <AppLink to="/contact" className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                {t("contact")}
                                            </AppLink>
                                        </li>
                                        <li>
                                            <AppLink to="/settings" className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                {t("settings")}
                                            </AppLink>
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
                                                        <AppLink to={`/products`} className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                            {t("all")}
                                                        </AppLink>
                                                    </li>
                                                    {data?.data?.map((cat: StrapiCategory) => {
                                                        return (
                                                            <li key={cat.id}>
                                                                <AppLink to={`/products?category=${cat.documentId}`} className="block rounded-md p-2 hover:bg-(--primary-hover)">
                                                                    {cat.title}
                                                                </AppLink>
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
                    <div className="flex items-center gap-2">
                        {/* User Profile */}
                        <UserProfileIcon allowedRole="user" />
                        {/* Actions */}
                        <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => {
                            if (cartItems.length === 0) {
                                toast.info(t("noProducts") + " " + t("inCart") + t("browserProducts"));
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