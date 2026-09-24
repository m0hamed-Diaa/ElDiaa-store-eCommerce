import { useLocale } from "@/lib/useLocale";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailConfirmation() {
    const navigate = useNavigate();
    const { isRTL, lang } = useLocale();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(`/${lang}/login`, { replace: true });
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
                    ✓
                </div>

                <h1 className="mb-3 text-2xl font-bold text-green-600">
                    {isRTL ? " تم تأكيد البريد الإلكتروني" : "Email Confirmed"}
                </h1>

                <p className="text-gray-500">
                    {isRTL ? " تم تفعيل حسابك بنجاح." : "Your account has been successfully activated."}
                </p>

                <p className="text-gray-500">
                    {isRTL ? "نحتاج منك تسجيل الدخول مرة اخري لتاكيد الحساب" : "You need to log in again to confirm your account."}
                </p>

                <p className="mt-3 text-sm text-gray-400">
                    {isRTL ? "جاري تحويلك إلى  صفحة تسجيل الدخول..." : "Redirecting you to the login page..."}
                </p>
            </div>
        </div>
    );
}