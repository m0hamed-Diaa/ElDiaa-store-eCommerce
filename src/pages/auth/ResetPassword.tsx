import { z } from "zod";
import { Navigate, useSearchParams } from "react-router-dom";
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
import { useResetPasswordMutation } from "@/app/users/authApi";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { getAuth } from "@/lib/authCookies";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/lib/useLocale";
import { useLocaleNavigate } from "@/lib/useLocaleNavigate";

const createResetSchema = (isRTL: boolean) => z.object({
    password: z
        .string()
        .min(
            8,
            `${isRTL ? "كلمة المرور يجب ان تكون قوية و 8 احرف على الاقل" : "Password must be strong & at least 8 characters"}`
        ),

    confirmPassword: z.string(),
})
    .refine(
        (data) =>
            data.password ===
            data.confirmPassword,
        {
            message:
                `${isRTL ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"}`,
            path: ["confirmPassword"],
        }
    );


export default function ResetPasswordPage() {
    if (getAuth()?.token) {
        return <Navigate to="/ar/" replace />;
    }
    const { t } = useTranslation("common");
    const { isRTL } = useLocale();

    const localeNavigate = useLocaleNavigate();
    const [searchParams] =
        useSearchParams();
    // show password 
    const [showPassword, setShowPassword] =
        useState(false);

    const code =
        searchParams.get("code");

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const resetSchema =
        createResetSchema(isRTL);

    type FormValues =
        z.infer<typeof resetSchema>;

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
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (
        values: FormValues
    ) => {
        try {
            await resetPassword({
                code,
                password: values.password,
                passwordConfirmation:
                    values.confirmPassword,
            }).unwrap();
            reset();
            toast.success(`${isRTL ? "كلمة المرور اتعدلت بنجاح" : "Password updated successfully"}`);
            localeNavigate("/login");
        } catch {
            toast.error(
                (isRTL
                    ? "حصلت غلطة"
                    : "Something went wrong")
            );
        }
    };

    return (
        <AuthLayout>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        {t("resetPassword")}
                    </CardTitle>

                    <CardDescription>
                        {t("createNewReset")}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                        className="space-y-4"
                    >
                        <div className="relative">
                            <Input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder={isRTL ? " باسورد جديدة..." : "New Password..."}
                                disabled={isLoading || isSubmitting}
                                {...register(
                                    "password"
                                )}
                            />

                            <button
                                type="button"
                                className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`}
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {
                                        errors
                                            .password
                                            .message
                                    }
                                </p>
                            )}
                        </div>


                        <div className="relative">
                            <Input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder={`${isRTL ? "تاكيد الباسورد..." : "Confirm Password..."}`}
                                disabled={isLoading || isSubmitting}
                                {...register(
                                    "confirmPassword"
                                )}
                            />

                            <button
                                type="button"
                                className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`}
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {
                                        errors
                                            .confirmPassword
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <Button
                            className="w-full"
                            disabled={
                                isLoading || isSubmitting
                            }
                        >
                            {isLoading || isSubmitting ? <>

                                {`${isRTL ? "جار التحميل..." : "Loading ..."}`}
                                <Spinner />
                            </>
                                :

                                <>
                                    {t("resetPassword")}
                                </>
                            }
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}