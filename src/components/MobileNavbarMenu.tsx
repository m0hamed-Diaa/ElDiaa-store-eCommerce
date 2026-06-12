import { ChevronRight, Menu, ShoppingCart } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { memo, useCallback, useState } from "react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { RootState } from "@/app/store";
import DarkModeToggle from "./ui/DarkModeToggle";
import LanguageToggle from "./ui/LanguageToggle";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCartItems } from "@/app/features/cartSlice";
import { useGetCategoriesQuery } from "@/app/categories/user/categoryApi";
import type { StrapiCategory } from "@/interfaces";
import { openCartDrawer } from "@/app/features/uiSlice";
import { getAuth, removeAuth } from "@/lib/authCookies";
import { useGetProfileQuery } from "@/app/users/profileApi";
import { GoPerson, GoSignOut } from "react-icons/go";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { DialogDemo } from "./shared/DialogDemo";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

const MobileNavbarMenu = () => {
    const [open, setOpen] = useState(false);
    const closeSheet = useCallback(() => {
        setOpen(false);
    }, [])
    const { t } = useTranslation("common");
    const lang = useSelector((state: RootState) => state.language.lang);
    const isRTL = lang === "ar";
    const cartItems = useAppSelector(selectCartItems);
    const { data } = useGetCategoriesQuery({ lang });
    const dispatch = useAppDispatch();

    const [islogout, setLogout] = useState(false);
    const handleLogout = () => {
        setLogout(true);
        removeAuth();
        localStorage.removeItem("rememberedEmail");
        toast.success(t("logoutMessage"))
    }

    // User Data
    const userLoggedIn = getAuth();
    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useGetProfileQuery(userLoggedIn?.userId);
    return (
        <div>
            <div className="flex items-center gap-3 md:hidden">
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

                {/* Cart */}
                <Button
                    size="icon"
                    variant="outline"
                    className="relative rounded-full border-border/60 bg-background/80 backdrop-blur-md"
                    onClick={(e) => {
                        e.currentTarget.blur();
                        dispatch(openCartDrawer());
                    }}
                >
                    <ShoppingCart size={18} />
                    <span className={`absolute -top-1 text-sm text-primary left-[40%]`}>{cartItems.length}</span>
                </Button>

                {/* Menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full border-border/60 bg-background/80 backdrop-blur-md"
                        >
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side={isRTL ? "right" : "left"}
                        className="contain-content w-50 border-border/50 bg-background/95 backdrop-blur-xl [&>button]:right-4 rtl:[&>button]:left-4 rtl:[&>button]:right-auto"
                    >
                        <SheetHeader>
                            <SheetTitle className={`mt-4 text-lg ${isRTL ? "mr-4" : "ml-4"}`}>
                                {t("welcome")} <span className="text-primary underline text-lg">{profileData?.username || "User"}</span> {t("to")} {t("appName")}
                            </SheetTitle>

                            {/* Logo */}
                            <SheetDescription className={`mt-4 flex text-primary font-bold  ${isRTL ? "mr-4" : "ml-4"}`}>
                                {t("appName")}
                                <br />
                                {t("appContentName")}
                            </SheetDescription>
                        </SheetHeader>

                        {/* Links */}
                        <nav className="flex flex-col gap-2 px-2">
                            <Link
                                to="/"
                                onClick={closeSheet}
                                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-accent"
                            >
                                {t("home")}
                                <ChevronRight size={18} />
                            </Link>

                            <Link
                                to="/products"
                                onClick={closeSheet}
                                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-accent"
                            >
                                {t("products")}
                                <ChevronRight size={18} />
                            </Link>

                            <Link
                                to="/about"
                                onClick={closeSheet}
                                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-accent"
                            >
                                {t("about")}
                                <ChevronRight size={18} />
                            </Link>

                            <Link
                                to="/contact"
                                onClick={closeSheet}
                                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-accent"
                            >
                                {t("contact")}
                                <ChevronRight size={18} />
                            </Link>
                            <Link
                                to="/settings"
                                onClick={closeSheet}
                                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-accent"
                            >
                                {t("settings")}
                                <ChevronRight size={18} />
                            </Link>
                        </nav>

                        {/* Categories */}
                        <div className="mt-8 border-t border-border/50 pt-6 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden border h-58">

                            <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {t("category")}
                            </p>

                            <div className="flex flex-col gap-2 px-2">

                                {data?.data?.length ?
                                    <>
                                        <Link to={`/products`} className="rounded-xl px-4 py-3 transition-all hover:bg-accent">
                                            {t("all")}
                                        </Link>
                                        {data?.data?.map((cat: StrapiCategory) => {
                                            return (
                                                <Link
                                                    key={cat.id}
                                                    to={`products?category=${cat?.documentId}`}
                                                    onClick={closeSheet}
                                                    className="rounded-xl px-4 py-3 transition-all hover:bg-accent"
                                                >
                                                    {cat.title}
                                                </Link>
                                            )
                                        })}
                                    </>
                                    : <div className="text-center mt-8 text-destructive">{t("categoriesNotFound")}</div>}
                            </div>
                        </div>
                        <div className="px-4 flex items-center gap-2">
                            {/* Language */}
                            <span onClick={closeSheet}>
                                <LanguageToggle />
                            </span>
                            {/* Dark Mode */}
                            <DarkModeToggle />
                        </div>
                        {/* Bottom CTA */}
                        <div className="absolute bottom-6 left-4 right-4">
                            <Button disabled={!cartItems.length} className="w-full text-base font-semibold" onClick={((e) => {
                                e.currentTarget.blur();
                                dispatch(openCartDrawer());
                                closeSheet();
                            })}>
                                {isRTL ?
                                    <>
                                        {t("view")} {t("cart")}
                                        <ShoppingCart size={18} />
                                    </> :
                                    <>
                                        <ShoppingCart size={18} />
                                        {t("view")} {t("cart")}
                                    </>
                                }
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

export default memo(MobileNavbarMenu);
