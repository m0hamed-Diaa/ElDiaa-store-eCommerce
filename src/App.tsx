import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { setDirection } from "@/lib/direction";
import AuthProvider from "./components/auth/AuthProvider";

const App = () => {
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setDirection(lang as "ar" | "en");
  }, []);
  return (
    <main>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </main>
  );
};

export default App;