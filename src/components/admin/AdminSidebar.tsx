import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FolderTree,
    Star,
    TicketPercent,
    BarChart3,
    Settings,
    LogOut,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";
import { useSidebar } from "@/components/ui/sidebar";
import { getAuth, removeAuth } from "@/lib/authCookies";
import { useGetCustomerByUserQuery, useGetProfileQuery } from "@/app/users/profileApi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { GoPerson } from "react-icons/go";
import { DialogDemo } from "../shared/DialogDemo";
import { toast } from "sonner";
import { useState } from "react";

const Pages = [
    {
        title: "dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },

    {
        title: "products",
        url: "/admin/products",
        icon: Package,
    },

    {
        title: "categories",
        url: "/admin/categories",
        icon: FolderTree,
    },
    {
        title: "heroSlides",
        url: "/admin/hero-slides",
        icon: Users,
    },
    {
        title: "orders",
        url: "/admin/orders",
        icon: ShoppingCart,
    },

    {
        title: "users",
        url: "/admin/users",
        icon: Users,
    },

    {
        title: "reviews",
        url: "/admin/reviews",
        icon: Star,
    },

    {
        title: "coupons",
        url: "/admin/coupons",
        icon: TicketPercent,
    },

    {
        title: "analytics",
        url: "/admin/analytics",
        icon: BarChart3,
    },

    {
        title: "settings",
        url: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    const navigate = useNavigate();
    const { t } = useTranslation("adminCommon");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";

    const userLoggedIn = getAuth();
    const { data: profileData, isLoading } = useGetProfileQuery(userLoggedIn?.userId);
    const { data: customerData, isLoading: isCustomerLoading } = useGetCustomerByUserQuery(userLoggedIn?.userId);

    const { state, setOpenMobile, isMobile } = useSidebar();
    const isCollapsed = state === "collapsed";
    const handleClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    // Logout function
    const [islogout, setLogout] = useState(false);
    const handleLogout = () => {
        setLogout(true);
        removeAuth();
        localStorage.removeItem("rememberedEmail");
        toast.success(t("logoutMessage"));
        navigate("/admin/login", { replace: true })
    }
    return (
        <Sidebar
            side={isRTL ? "right" : "left"}
            collapsible="icon"
            className={`
                bg-background/95
                backdrop-blur-xl
            `}
        >
            {/* HEADER */}
            <SidebarHeader className={`border-b ${isCollapsed ? "p-2" : "p-4"}`}>

                <Link to="/admin/settings/profile" onClick={handleClick} className={`
                        flex items-center
                        ${isCollapsed ? "justify-center" : "gap-3"}
                    `}>

                    {isCollapsed ? (
                        <>
                            {isLoading || isCustomerLoading ? <Skeleton className="h-8 w-8 rounded-full" /> : (<Avatar className="h-8 w-8" >
                                <AvatarImage src={customerData?.avater?.formats?.small?.url || customerData?.avater?.url} />
                                <AvatarFallback>{profileData?.username?.charAt(0).toUpperCase() || <GoPerson />}</AvatarFallback>
                            </Avatar>)}</>
                    ) : (
                        <>
                            {isLoading || isCustomerLoading ? <div className="flex items-center gap-4">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div>
                                    <Skeleton className="h-4 w-25" />
                                    <Skeleton className="h-4 w-20 mt-2" />
                                </div>
                            </div> : (
                                <>
                                    <Avatar className="h-9 w-9" >
                                        <AvatarImage src={customerData?.avater?.formats?.small?.url || customerData?.avater?.url} />
                                        <AvatarFallback>{profileData?.username?.charAt(0).toUpperCase() || <GoPerson />}</AvatarFallback>
                                    </Avatar>
                                    {profileData?.username ?
                                        <div className="flex flex-col">
                                            <h2 className="text-sm font-bold">
                                                {profileData?.username || "-"}
                                            </h2>

                                            <p className="text-xs text-muted-foreground">
                                                {t("superAdmin")}
                                            </p>
                                        </div> : <p>{isRTL ? "جار التحميل..." : "loading"}</p>
                                    }
                                </>
                            )}


                        </>

                    )}
                </Link>
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {t("management")}
                    </SidebarGroupLabel>
                    <SidebarGroupContent >
                        <SidebarMenu className="space-y-2">
                            {Pages.map((item) => (
                                <SidebarMenuItem key={item.title} onClick={handleClick}>
                                    <NavLink
                                        to={item.url}
                                        end={item.url === "/admin"}
                                        className={({ isActive }) =>
                                            `
                                                    flex items-center gap-3 text-sm rounded-xl px-3 py-5
                                                    transition-all duration-200 hover:scale-[1.02]
                                                    ${isActive
                                                ? `
                                                            bg-primary
                                                            text-primary-foreground
                                                            shadow-lg
                                                        `
                                                : `
                                                            hover:bg-accent
                                                            hover:text-accent-foreground
                                                        `
                                            }
                                                    `
                                        }
                                    >
                                        {isCollapsed ? <item.icon className="w-1 h-1 scale-[4]" /> : <>
                                            <item.icon className="h-5 w-5" />
                                            <span className="font-medium">
                                                {t(item.title)}
                                            </span></>}
                                    </NavLink>

                                </SidebarMenuItem>
                            ))}

                        </SidebarMenu>

                    </SidebarGroupContent>

                </SidebarGroup>

            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter className={`border-t ${isCollapsed ? "p-2" : "p-4"}`}>
                <DialogDemo loading={islogout} submitButton={t("logout")} onClick={() => handleLogout()} title={`${isRTL ? "هل انت متاكد من تسجيل الخروج!" : "Are you sure you logout!"}`} description={`${isRTL ? "لو سجلت الخروج، ستحتاج لتسجيل الدخول مرة اخرى" : "If you logout, you'll need to log in again."}`}
                    children={
                        <Button className={`
                        w-full ${isCollapsed ? "justify-center px-2" : ""}`} variant={"destructive"}>
                            {!isCollapsed && t("logout")}
                            <LogOut className="h-4 w-4" />
                        </Button>
                    } />
            </SidebarFooter>
        </Sidebar >
    );
}