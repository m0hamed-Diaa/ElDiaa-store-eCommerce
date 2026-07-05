import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Footer from "@/components/Footer";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { usePageTitle } from "@/components/usePageTitle";


export default function AdminLayout() {
    usePageTitle("الأدمن | متجر الضياء للإلكترونيات", "Admin | El-diaa Store For Electronics")


    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
                {/* HEADER */}
                <header className="flex h-16 items-center gap-4 border-b px-2">
                    <SidebarTrigger title="Ctrl+B" />
                </header>
                {/* PAGE CONTENT */}
                <main className="min-h-screen md:p-5">
                    <Outlet />
                </main>
                {/* FOOTER */}
                <Footer />

            </SidebarInset>
        </SidebarProvider>
    );
}