import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaHome } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useTranslation } from "react-i18next";
import diaaLogo from "@/assets/diaa-logo.png";

interface IProps {
  statusCode?: number;
  path: string;
}
const ErrorHandler = ({
  path,
  statusCode = 500,

}: IProps) => {
  const { t } = useTranslation("common");
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 absolute top-0 left-0 z-999999">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-center">
          <div className="relative">
            <img src={diaaLogo} alt="imageStore" className="w-60 h-60 md:w-80 md:h-80 border border-(--primary-hover) object-cover rounded-full" />
          </div>
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-8xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {statusCode}
          </h1>
          <div className="h-1 w-24 bg-(--primary-hover) mx-auto rounded-full"></div>
        </div>

        {/* Error Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          {t("serverError")}
        </h2>

        {/* Error Message */}
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          {t("serverErrorContent")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to={`${path}`} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {t("backHome")}
              <FaHome className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            </Button>
          </Link>

          <Button
            onClick={handleRefresh}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
          >
            {t("refresh")}
            <IoMdRefresh className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          </Button>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            <span>{t("needHelp")}</span>
            <a
              href="tel:+201095382588"
            >
              <Button variant={"outline"} className="p-2 ml-2 rtl:ml-0 rtl:mr-2">
                {t("contactSupport")} 📞
              </Button>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;