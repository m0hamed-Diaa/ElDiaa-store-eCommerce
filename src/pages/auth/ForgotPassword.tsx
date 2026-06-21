import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import AuthLayout from "./AuthLayout";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { selectLang } from "@/app/features/language/languageSlice";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/app/users/authApi";
import { Navigate } from "react-router-dom";
import { getAuth } from "@/lib/authCookies";

const createResetSchema = (isRTL: boolean) => z.object({
    email: z
        .string()
        .email(`${isRTL ? "عنوان الإيميل غلط" : "Invalid email address"}`)
})

export default function ForgotPasswordPage() {
    if (getAuth()?.token) {
        return <Navigate to="/" replace />;
    }
    const { t } = useTranslation("common");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";

    const resetSchema =
        createResetSchema(isRTL);

    type FormValues =
        z.infer<typeof resetSchema>;

    const [forgot, { isLoading }] = useForgotPasswordMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<FormValues>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = async (
        values: FormValues
    ) => {
        try {
            await forgot({
                email: values.email,
            }).unwrap();

            reset();

            toast.success(
                isRTL
                    ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
                    : "Password reset link sent to your email"
            );

        } catch {
            toast.error(
                (isRTL
                    ? "فشل إرسال الرابط"
                    : "Failed to send reset link")
            );
        }
    };

    return (
        <AuthLayout>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        {t("forgotPassword")}
                    </CardTitle>

                    <CardDescription>
                        {t("forgotPassContent")}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                        className="space-y-4"
                    >
                        <Input
                            type="email"
                            placeholder={isRTL ? "ايميلك..." : "Your email..."}
                            disabled={isLoading || isSubmitting}
                            {...register(
                                "email"
                            )}
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {
                                    errors
                                        .email
                                        .message
                                }
                            </p>
                        )}

                        <Button
                            className="w-full"
                            disabled={
                                isLoading
                            }
                        >
                            {isLoading ? <>

                                {`${isRTL ? "جار التحميل..." : "Loading ..."}`}
                                <Spinner />
                            </>
                                :

                                <>
                                    {t("resetLink")}
                                </>
                            }
                        </Button>

                    </form>

                </CardContent>
            </Card>
        </AuthLayout>
    );
}