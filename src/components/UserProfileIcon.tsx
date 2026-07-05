import { Separator } from "./ui/separator";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu'
import { DialogDemo } from "./shared/DialogDemo";
import { GoPerson, GoSignOut } from "react-icons/go";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CiSettings } from "react-icons/ci";
import { FaExchangeAlt } from "react-icons/fa";
import { getAuth, removeAuth } from "@/lib/authCookies";
import { useGetCustomerByUserQuery, useGetProfileQuery } from "@/app/users/profileApi";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { selectLang } from "@/app/features/language/languageSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Skeleton } from "./ui/skeleton";

interface IUserProps {
    allowedRole?: "user" | "admin";
}

const UserProfileIcon = ({ allowedRole }: IUserProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation("common");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    // Go to currentPage
    const { saveCurrentPage } =
        useAuthRedirect();

    const userLoggedIn = getAuth();
    // Check if user | admin
    if (userLoggedIn?.role !== allowedRole && userLoggedIn?.role) return;

    const isAdmin = userLoggedIn?.role === "admin";
    const settingsBasePath = isAdmin ? "/admin/settings" : "/settings";
    const roleLabel = isRTL ?
        isAdmin ? "الأدمن" : "مستخدم"
        : isAdmin ? "Admin" : "User";
    const loginPath = isAdmin
        ? "/admin/login"
        : "/login";

    const registerPath = "/register";

    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useGetProfileQuery(userLoggedIn?.userId);
    const { data: customerData, isLoading } = useGetCustomerByUserQuery(userLoggedIn?.userId);
    const [islogout, setLogout] = useState(false);

    // Logout function
    const handleLogout = () => {
        setLogout(true);
        removeAuth();
        localStorage.removeItem("rememberedEmail");
        toast.success(t("logoutMessage"));
        navigate("/", { replace: true })
    }
    if (isProfileLoading || isLoading) {
        return (<Skeleton className="h-9 w-9 rounded-full" />)
    }
    return (
        <>
            {userLoggedIn?.role ? (
                <NavigationMenu dir={isRTL ? "rtl" : "ltr"}>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={customerData?.avater?.formats?.small?.url || customerData?.avater?.url} />
                                    <AvatarFallback>{profileData?.username?.charAt(0).toUpperCase() || <GoPerson />}</AvatarFallback>
                                </Avatar>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-accent z-50">
                                <ul className="w-50 p-2">
                                    {isProfileLoading || isProfileError ? <p>{isRTL ? "تحميل البيانات..." : "Data loading..."}</p> :
                                        <>
                                            <li>
                                                <p className="text-sm text-muted-foreground overflow-x-auto p-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
                                                    {profileData?.email}
                                                </p>
                                            </li>
                                            <p className="bg-accent text-center border rounded-xl mx-auto w-fit my-2 p-2">
                                                {roleLabel}
                                            </p>
                                            <Separator className="my-2" />
                                            <li>
                                                <Link to={settingsBasePath}>
                                                    <Button variant={"secondary"} fullWidth className="text-white text-sm mb-2">
                                                        {t("settings")} <CiSettings />
                                                    </Button>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={`${settingsBasePath}/profile`}>
                                                    <Button variant={"secondary"} fullWidth className="text-white text-sm mb-2">
                                                        {t("profile")} <GoPerson />
                                                    </Button>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={`${settingsBasePath}/profile/change-password`}>
                                                    <Button variant={"secondary"} fullWidth className="text-white text-sm mb-2">
                                                        {t("changePassword")} <FaExchangeAlt />
                                                    </Button>
                                                </Link>
                                            </li>
                                            <li>
                                                <DialogDemo loading={islogout} submitButton={t("logout")} onClick={() => handleLogout()} title={`${isRTL ? "هل انت متاكد من تسجيل الخروج!" : "Are you sure you logout!"}`} description={`${isRTL ? "لو سجلت الخروج، ستحتاج لتسجيل الدخول مرة اخرى" : "If you logout, you'll need to log in again."}`} children={<Button fullWidth variant={"destructive"}>
                                                    {t("logout")} <GoSignOut />
                                                </Button>
                                                } />
                                            </li>
                                        </>
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
                                        <Link to={loginPath} onClick={saveCurrentPage}>
                                            <Button variant="link" className="w-fit text-white">
                                                {t("login")}
                                            </Button>
                                        </Link>
                                    </li>
                                    {!isAdmin && (<li className="flex items-center">
                                        <p>{t("dontHaveAccount")}</p>
                                        <Link to={registerPath} onClick={saveCurrentPage}>
                                            <Button variant="link" className="w-fit mx-auto text-white">
                                                {t("register")}
                                            </Button>
                                        </Link>
                                    </li>)}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </ NavigationMenu>
            )}
        </>
    )
}

export default UserProfileIcon
