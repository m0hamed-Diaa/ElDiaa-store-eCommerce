import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import diaaLogo from "@/assets/diaa-logo.png";
import { FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectLang } from "@/app/features/language/languageSlice";

const PageNotFound = () => {
  const location = useLocation();

  const homePath =
    location.pathname.startsWith("/admin")
      ? "/admin"
      : "/";

  const { t } = useTranslation("common");
  const lang = useSelector(selectLang);
  const isRTL = lang === "ar";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 p-4">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col items-center justify-center gap-12">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            </div>
            <div className="relative mb-4">
              <img src={diaaLogo} alt="imageStore" className="mx-auto w-60 h-60 md:w-80 md:h-80 border border-(--primary-hover) object-cover rounded-full" />
            </div>
            <div className="relative text-center">
              <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-primary via-indigo-600 to-(--primary-hover) leading-none text-center animate-in zoom-in duration-700">
                404
              </h1>
              <div
                className="absolute top-1/4 -left-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute bottom-1/4 -right-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-6 animate-in slide-in-from-right duration-700">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {t("PageNotFound")}
              </h2>
              <div className="h-1 w-40 bg-linear-to-r from-(-primary) to-(--primary-hover) rounded-full mx-auto mt-4"></div>
            </div>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
              {t("pageNotFoundContent")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Link to={homePath} className="w-full sm:w-fit">
                <Button>
                  {isRTL ?
                    <>
                      {t("backHome")}
                      <FaHome />
                    </>
                    :
                    <>
                      <FaHome />
                      {t("backHome")}
                    </>}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;