import { CartDrawer } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";
import { usePageTitle } from "@/components/usePageTitle";


export default function UserLayout() {
  usePageTitle("متجر الضياء للإلكترونيات", "El-diaa Store For Electronics");

  return (
    <>
      <NavBar />
      <CartDrawer />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
