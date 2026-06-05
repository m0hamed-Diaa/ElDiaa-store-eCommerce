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

import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import LanguageToggle from "../ui/LanguageToggle";
import { useTranslation } from "react-i18next";
import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";
import { useSidebar } from "@/components/ui/sidebar";
import DarkModeToggle from "../ui/DarkModeToggle";

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
    const { t } = useTranslation("adminCommon");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    const { state, setOpenMobile, isMobile } = useSidebar();
    const isCollapsed = state === "collapsed";
    const handleClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };
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

                <div className={`
                        flex items-center
                        ${isCollapsed ? "justify-center" : "gap-3"}
                    `}>

                    {isCollapsed ? (

                        <Button
                            className="
            flex h-8 w-8 items-center justify-center
            rounded-full bg-primary text-md font-bold text-white
        "
                        >
                            M
                        </Button>
                    ) : (
                        <>
                            <img
                                src="https://res.cloudinary.com/dper3maw4/image/upload/v1779563885/thumbnail_PXL_20220514_114447285_PORTRAIT_3ce6d1595f.jpg"
                                alt="Admin"
                                className="
                h-12 w-12 rounded-full
                border-2 border-primary
                object-cover
            "
                            />

                            <div className="flex flex-col">
                                <h2 className="text-sm font-bold">
                                    Mohamed Diaa
                                </h2>

                                <p className="text-xs text-muted-foreground">
                                    {t("superAdmin")}
                                </p>
                            </div>
                        </>

                    )}
                </div>
            </SidebarHeader>

            <LanguageToggle />
            <DarkModeToggle />

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
                <Button
                    variant={"destructive"}
                    className={`
                        w-full
                        ${isCollapsed ? "justify-center px-2" : ""}
                    `}
                >
                    {!isCollapsed && t("logout")}
                    <LogOut className="h-4 w-4" />
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}