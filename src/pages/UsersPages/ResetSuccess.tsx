import { useNavigate } from "react-router-dom";
import { useLocale } from "@/lib/useLocale";
import ForPassCom from "@/assets/ForgetPasswordComplete.png";
import { Button } from "@/components/ui/button";


export default function ResetSuccess() {
    const navigate = useNavigate();
    const { isRTL, lang } = useLocale();

    return (
        <div className="min-h-screen pt-20 md:pt-0 flex-row md:flex items-center justify-center px-4">
            <img src={ForPassCom} alt="imageStore" className="w-70 h-70 mx-auto md:mx-0 md:w-80 md:h-80 object-cover" />

            <div className="w-full md:max-w-md rounded-2xl p-8 text-center shadow-2xs border">

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground">
                    ✓
                </div>

                <h1 className="mb-3 text-2xl font-bold text-primary">
                    {isRTL ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully"}
                </h1>

                <p className="text-gray-500 mb-2">
                    {isRTL ? "تهانينا! تم تأكيد البريد البريد الإلكتروني بنجاح يمكنك الآن تسجيل الدخول باستخدام بياناتك المحدثة والاستمتاع بتجربة آمنة وسلسة." : "Congratulations! You have successfully verified your email. You can now log in with your updated info and enjoy a safe and smooth experience."}
                </p>

                <Button fullWidth onClick={() => navigate(`/${lang}/login`)}>{isRTL ? "تسجيل الدخول" : "Login"}</Button>
            </div>
        </div>
    );
}