import {
    User,
    Shield,
    Palette,
    Globe,
    Package,
    LogOut,
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
import { Link } from "react-router-dom";

export default function SettingsPage() {
    const { t } = useTranslation("settings");

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
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>MD</AvatarFallback>
                                </Avatar>

                                <h2 className="mt-4 text-lg font-semibold">
                                    Mohamed Diaa
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    {t("user")}
                                </p>
                            </div>

                            <Separator className="mb-4" />

                            <nav className="flex flex-col gap-2">
                                <Link to="/settings/profile">
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
                            <Button
                                variant="destructive"
                                className="w-full rounded-xl"
                            >
                                {t("logout")}
                                <LogOut size={18} />
                            </Button>

                        </CardContent>
                    </Card>

                    {/* Content */}
                    <div className="space-y-6">

                        {/* Profile */}
                        <Card className="rounded-2xl border-border/50">
                            <CardHeader>
                                <CardTitle> {t("profileContent")} </CardTitle>

                                <CardDescription>
                                    {t("userProfileContent")}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-4 md:grid-cols-2">

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {t("userFullName")}
                                    </label>

                                    <input
                                        defaultValue="Mohamed Diaa"
                                        className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {t("userEmail")}
                                    </label>

                                    <input
                                        defaultValue="mohamed@example.com"
                                        className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
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
                        <Card className="rounded-2xl border-border/50" id="orders">
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
                        </Card>

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

                                    <Button variant="outline">
                                        {t("update")}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

