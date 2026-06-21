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
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { selectLang } from "@/app/features/language/languageSlice";
import { useChangePasswordMutation } from "@/app/users/profileApi";
import { useNavigate } from "react-router-dom";
import { removeAuth } from "@/lib/authCookies";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { usePageTitle } from "@/components/usePageTitle";

const ChangePasswordSchema = (
    isRTL: boolean
) =>
    z
        .object({
            currentPassword: z
                .string()
                .min(
                    1,
                    isRTL
                        ? "ادخل كلمة المرور الحالية"
                        : "Current password is required"
                ),

            password: z
                .string()
                .min(
                    8,
                    isRTL
                        ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
                        : "Password must be at least 8 characters"
                ),

            confirmPassword: z
                .string()
                .min(
                    1,
                    isRTL
                        ? "أكد كلمة المرور"
                        : "Confirm password is required"
                ),
        })
        .refine(
            (data) =>
                data.password ===
                data.confirmPassword,
            {
                path: ["confirmPassword"],
                message: isRTL
                    ? "كلمتا المرور غير متطابقتين"
                    : "Passwords do not match",
            }
        );


export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const { t } = useTranslation("common");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    usePageTitle("تغيير الباسورد | متجر الضياء للإلكترونيات", "change Password | El-diaa Store For Electronics")

    // show current password
    const [showCurrentPassword, setCurrentPassword] =
        useState(false);
    // show new password
    const [showPassword, setShowPassword] =
        useState(false);

    const [changePassword, { isLoading }] =
        useChangePasswordMutation();
    const resetSchema =
        ChangePasswordSchema(isRTL);

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
            currentPassword: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (
        values: FormValues
    ) => {
        try {
            await changePassword({
                currentPassword:
                    values.currentPassword,

                password:
                    values.password,

                passwordConfirmation:
                    values.confirmPassword,
            }).unwrap();
            reset();

            // Required Logout
            removeAuth();
            localStorage.removeItem("rememberedEmail");
            // Go to Login Page
            setTimeout(() => {
                navigate("/login");
            }, 1000);

            toast.success(
                isRTL
                    ? "تم تغيير كلمة المرور بنجاح، اعمل تسجيل دخول من جديد للأمان"
                    : "Password changed successfully, login again for security"
            );
        } catch {
            toast.error(
                (isRTL
                    ? "فشل فى تغيير كلمة المرور او كلمة مرورك القديمة غلط!"
                    : "Failed to change password or your old password is false!")
            );
        }
    };

    return (
        <div className="flex items-center justify-center h-[84vh]">
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
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder={isRTL ? "ادخل كلمة مرورك القديمة..." : "Enter ypur old Password..."}
                                disabled={isLoading || isSubmitting}
                                {...register(
                                    "currentPassword"
                                )}
                            />

                            <button
                                type="button"
                                className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`}
                                onClick={() =>
                                    setCurrentPassword(
                                        !showCurrentPassword
                                    )
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                            {errors.currentPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {
                                        errors
                                            .currentPassword
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
        </div>
    );
}