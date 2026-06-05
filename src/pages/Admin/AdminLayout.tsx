import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Footer from "@/components/Footer";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {

    return (
        <SidebarProvider>

            <AdminSidebar />
            <SidebarInset className="overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
                {/* HEADER */}
                <header className="flex h-16 items-center gap-4 border-b px-6">
                    <SidebarTrigger />
                </header>
                {/* PAGE CONTENT */}
                <main className="min-h-screen p-2 md:p-6">
                    <Outlet />
                </main>
                {/* FOOTER */}
                <Footer />

            </SidebarInset>
        </SidebarProvider>
    );
}