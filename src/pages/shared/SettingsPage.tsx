import {
    User,
    Shield,
    Palette,
    Globe,
    Package,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, removeAuth } from "@/lib/authCookies";
import { useGetCustomerByUserQuery, useGetProfileQuery } from "@/app/users/profileApi";
import { GoPerson, GoSignOut } from "react-icons/go";
import { FaExchangeAlt } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";
import { DialogDemo } from "@/components/shared/DialogDemo";
import { useAppSelector } from "@/app/hooks";
import { selectLang } from "@/app/features/language/languageSlice";
import SettingsSkeleton from "@/components/skeletons/SettingsSkeleton";

export default function SettingsPage() {
    const navigate = useNavigate();
    const { t } = useTranslation("settings");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    const userLoggedIn = getAuth();
    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useGetProfileQuery(userLoggedIn?.userId);
    const { data: customer } = useGetCustomerByUserQuery(userLoggedIn?.userId);
    const isAdmin = profileData?.accountType === "admin";
    const settingsPath = isAdmin ? "/admin/settings/profile" : "/settings/profile"
    const changePasswordPath = isAdmin ? "/admin/settings/profile/change-password" : "/settings/profile/change-password"

    const [islogout, setLogout] = useState(false);

    const handleLogout = () => {
        setLogout(true);
        removeAuth();
        localStorage.removeItem("rememberedEmail");
        toast.success(t("logoutMessage"));
        navigate("/", { replace: true })
    }

    if (isProfileLoading) {
        return (
            <div className="p-4">
                <SettingsSkeleton />
            </div>
        )
    }

    if (isProfileError) {
        return <div className="text-red-500 min-h-[90vh] flex items-center justify-center">{t("errorHandling")} {t("signInFirst")}</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight">
                        {t("settings")}
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        {t("settingsPageContent")}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

                    {/* Sidebar */}
                    <Card className="h-fit rounded-2xl border-border/50">
                        <CardContent className="p-4">
                            <div className="mb-6 flex flex-col items-center text-center">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={customer?.avater?.formats?.small?.url || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>{profileData?.username?.charAt(0).toUpperCase() || <GoPerson size={"30"} />}</AvatarFallback>
                                </Avatar>

                                <h2 className="mt-4 text-lg font-semibold">
                                    {profileData?.username}
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    {isAdmin ? t("admin") : t("user")}
                                </p>
                            </div>

                            <Separator className="mb-4" />

                            <nav className="flex flex-col gap-2">
                                <Link to={settingsPath}>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 rounded-xl"
                                    >
                                        <User size={18} />
                                        {t("profile")}
                                    </Button>
                                </Link>
                                <a href="#appearance" className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 rounded-xl"
                                    >
                                        <Palette size={18} />
                                        {t("appearance")}
                                    </Button>
                                </a>

                                <a href="#language" className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 rounded-xl"
                                    >
                                        <Globe size={18} />
                                        {t("language")}
                                    </Button>
                                </a>

                                <a href="#orders" className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 rounded-xl"
                                    >
                                        <Package size={18} />
                                        {t("orders")}
                                    </Button>
                                </a>

                                <a href="#security" className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 rounded-xl"
                                    >
                                        <Shield size={18} />
                                        {t("security")}
                                    </Button>
                                </a>
                            </nav>

                            <Separator className="my-4" />
                            <DialogDemo loading={islogout} submitButton={t("logout")} onClick={() => handleLogout()} title={`${isRTL ? "هل انت متاكد من تسجيل الخروج!" : "Are you sure you logout!"}`} description={`${isRTL ? "لو سجلت الخروج، ستحتاج لتسجيل الدخول مرة اخرى" : "If you logout, you'll need to log in again."}`} children={<Button fullWidth variant={"destructive"}>
                                {t("logout")} <GoSignOut />
                            </Button>} />

                        </CardContent>
                    </Card>

                    {/* Content */}
                    <div className="space-y-6">

                        {/* Profile */}
                        <Card className="rounded-2xl border-border/50">
                            <CardHeader className="flex items-center justify-between">
                                <div>
                                    <CardTitle> {t("profileContent")} </CardTitle>

                                    <CardDescription>
                                        {t("userProfileContent")}
                                    </CardDescription>
                                </div>
                                <Link to={settingsPath}><Button variant={"secondary"}>{t("refresh")}</Button></Link>
                            </CardHeader>

                            <CardContent className="grid gap-4 md:grid-cols-2">

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {t("userFullName")}
                                    </label>

                                    <input
                                        defaultValue={profileData?.username}
                                        className="w-full rounded-xl border bg-background px-4 py-3 pointer-events-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {t("userEmail")}
                                    </label>

                                    <input
                                        defaultValue={profileData?.email}
                                        className="w-full rounded-xl border bg-background px-4 py-3 pointer-events-none"
                                    />
                                </div>

                            </CardContent>
                        </Card>

                        {/* Appearance */}
                        <Card className="rounded-2xl border-border/50" id="appearance">
                            <CardHeader>
                                <CardTitle>{t("appearance")}</CardTitle>

                                <CardDescription>
                                    {t("appearanceContent")}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5" id="language">

                                <div className="flex items-center justify-between rounded-xl border p-4">
                                    <div>
                                        <h3 className="font-medium">
                                            {t("darkMode")}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {t("darkModeContent")}
                                        </p>
                                    </div>

                                    <DarkModeToggle />
                                </div>

                                <div className="flex items-center justify-between rounded-xl border p-4">
                                    <div>
                                        <h3 className="font-medium">
                                            {t("language")}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {t("languageContent")}
                                        </p>
                                    </div>

                                    <LanguageToggle />
                                </div>

                            </CardContent>
                        </Card>

                        {/* Orders */}
                        {!isAdmin && (<Card className="rounded-2xl border-border/50" id="orders">
                            <CardHeader>
                                <CardTitle>{t("recentOrders")}</CardTitle>

                                <CardDescription>
                                    {t("ordersContent")}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">

                                <div className="flex items-center justify-between rounded-xl border p-4">
                                    <div>
                                        <h3 className="font-medium">
                                            iPhone 15 Pro
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            Delivered Successfully
                                        </p>
                                    </div>

                                    <span className="text-sm font-semibold text-primary">
                                        $1299
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl border p-4">
                                    <div>
                                        <h3 className="font-medium">
                                            AirPods Pro
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            Processing Order
                                        </p>
                                    </div>

                                    <span className="text-sm font-semibold text-primary">
                                        $249
                                    </span>
                                </div>

                            </CardContent>
                        </Card>)}

                        {/* Security */}
                        <Card className="rounded-2xl border-border/50" id="security">
                            <CardHeader>
                                <CardTitle>{t("security")}</CardTitle>

                                <CardDescription>
                                    {t("securityContent")}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">

                                <div className="flex items-center justify-between rounded-xl border p-4">
                                    <div>
                                        <h3 className="font-medium">
                                            {t("changePassword")}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {t("passwordContent")}
                                        </p>
                                    </div>

                                    <Link to={changePasswordPath}>
                                        <Button variant={"secondary"} fullWidth className="text-white text-sm mb-2">
                                            {t("changePassword")} <FaExchangeAlt />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

