import { CartDrawer } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";


export default function UserLayout() {
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
