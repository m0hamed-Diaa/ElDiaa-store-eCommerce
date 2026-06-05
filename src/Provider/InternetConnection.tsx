import { useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { CiWifiOn, CiWifiOff } from "react-icons/ci";
import { setInternetStatus } from "@/app/features/Internet/internetSlice";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/app/hooks";

const InternetConnectionServicesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const toastIdRef = useRef<string | number | undefined>(undefined);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");

  useEffect(() => {
    const handleOnline = () => {
      dispatch(setInternetStatus(true));
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = undefined;
      }

      toast.success(`${t("internetPass")}`, {
        position: "top-center",
        icon: <CiWifiOn size={20} />,
        duration: 3000,
      });
    };

    const handleOffline = () => {
      dispatch(setInternetStatus(false));
      toastIdRef.current = toast.error(`${t("internetFail")}`, {
        description: `${t("internetContentFail")}`,
        position: "top-center",
        icon: <CiWifiOff size={20} />,
        duration: Infinity,
      });
    };
    // first Load
    dispatch(setInternetStatus(navigator.onLine));

    if (!navigator.onLine) {
      handleOffline();
    }
    // cleanup
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [dispatch, t]);

  return <>{children}</>;
};

export default InternetConnectionServicesProvider;