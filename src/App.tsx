import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { setDirection } from "@/lib/direction";
import AuthProvider from "./components/auth/AuthProvider";
import i18n from "./lib/i18n";

const App = () => {
  const locale = i18n.language;

  useEffect(() => {
    if (locale !== "ar" && locale !== "en") {
      window.location.href = "/ar";
      return;
    }
    const lang = locale === "en" ? "en" : "ar";

    i18n.changeLanguage(lang);
    setDirection(lang);

    localStorage.setItem("lang", lang);
  }, [locale]);

  return (
    <main>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </main>
  );
};

export default App;