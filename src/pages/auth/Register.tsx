import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { useRegisterMutation } from "@/app/users/authApi";
import AuthLayout from "./AuthLayout";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { getAuth } from "@/lib/authCookies";
import { Separator } from "@/components/ui/separator";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Spinner } from "@/components/ui/spinner";
import { useLocale } from "@/lib/useLocale";
import { AppLink } from "@/components/paths/AppLink";

export const createRegisterSchema = (
  isRTL: boolean
) =>
  z
    .object({
      username: z
        .string()
        .min(
          9,
          isRTL
            ? "يجب أن تدخل اسمك كاملا صحيحا مثلا.(على احمد على)"
            : "You should enter your true full name eg.(Ali ahmed Ali)"
        )
        .max(
          25,
          isRTL
            ? "اسم المستخدم طويل جداً"
            : "Username is too long"
        ),

      email: z
        .string()
        .email(
          isRTL
            ? "البريد الإلكتروني غير صحيح"
            : "Invalid email address"
        ),

      password: z
        .string()
        .min(
          8,
          isRTL
            ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
            : "Password must be at least 8 characters"
        ),

      confirmPassword: z.string(),
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

export default function RegisterPage() {
  const { isRTL, lang } = useLocale();
  if (getAuth()?.token) {
    return <Navigate to={`/${lang}`} replace />;
  }
  // Got to CurrentPage
  const { saveCurrentPage } =
    useAuthRedirect();

  const { t } = useTranslation("common");

  const [showPassword, setShowPassword] =
    useState(false);

  const [register, { isLoading }] =
    useRegisterMutation();

  const registerSchema = createRegisterSchema(isRTL);
  type RegisterValues =
    z.infer<ReturnType<
      typeof createRegisterSchema
    >>;

  const form =
    useForm<RegisterValues>({
      resolver:
        zodResolver(registerSchema),
      defaultValues: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }
    });


  const onSubmit = async (
    values: RegisterValues
  ) => {
    try {
      // Register
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
      }).unwrap();

      toast.success(
        isRTL
          ? "تم إنشاء الحساب، تحقق من بريدك لتأكيد الحساب"
          : "Account created, please check your email to confirm"
      );

    } catch (error: any) {
      const status = error?.data?.error?.status;
      const message =
        error?.data?.error?.message ||
        error?.data?.message ||
        "";

      if (
        status === 400 &&
        message.toLowerCase().includes("already taken")
      ) {
        toast.error(
          isRTL
            ? "اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل"
            : "Username or email already exists"
        );

        return;
      }

      toast.error(
        isRTL
          ? "حدث خطأ في الخادم، حاول مرة أخرى لاحقا"
          : "Server error, please try again later"
      );
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {t("createAccount")}
          </CardTitle>

          <CardDescription>
            {t("createAccountContent")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-5"
          >
            <Controller
              name="username"
              control={form.control}
              render={({
                field,
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>
                    {t("userName")}
                  </FieldLabel>

                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder={`${isRTL ? "ادخل اسمك كاملا..." : "Enter you full name..."}`}
                  />

                  {fieldState.error && (
                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({
                field,
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>
                    {t("email")}
                  </FieldLabel>

                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder={`${isRTL ? "ادخل إيميلك..." : "Enter you email..."}`}
                  />

                  {fieldState.error && (
                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({
                field,
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>
                    {t("password")}
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder={`${isRTL ? "ادخل رقم سري قوى..." : "Enter strong password..."}`}

                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
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
                        <EyeOff />
                      ) : (
                        <Eye />
                      )}
                    </button>
                  </div>

                  {fieldState.error && (
                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({
                field,
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>
                    {t("confirmPassword")}
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder={`${isRTL ? "أكد رقمك السري..." : "Confirm your password..."}`}
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
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
                        <EyeOff />
                      ) : (
                        <Eye />
                      )}
                    </button>
                  </div>

                  {fieldState.error && (
                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
                    />
                  )}
                </Field>
              )}
            />

            <Button
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {`${isRTL ? "جار إنشاء حساب..." : "Creating Account..."}`}
                  <Spinner />
                </>
              ) : (
                `${t("register")}`
              )}
            </Button>
            <Separator />
            <div className="flex items-center gap-2">
              <p>{t("alreadyHaveAccount")}</p>
              <AppLink
                to="/login"
                onClick={saveCurrentPage}
                className="text-primary"
              >
                {t("login")}
              </AppLink>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}