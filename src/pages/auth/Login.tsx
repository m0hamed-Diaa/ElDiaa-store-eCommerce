import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";
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

import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";
import { useLoginMutation } from "@/app/users/authApi";
import { saveAuth } from "@/lib/authCookies";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { selectLang } from "@/app/features/language/languageSlice";
import { Spinner } from "@/components/ui/spinner";

const createLoginSchema = (isRTL: boolean) => z.object({
  identifier: z
    .string()
    .min(8, `${isRTL ? "يجب أن يكون البريد الإلكتروني أو اسم المستخدم على الأقل 8 أحرف" : "Email or username must be at least 8 characters"}`),

  password: z
    .string()
    .min(6, `${isRTL ? "يجب أن تكون كلمة المرور على الأقل 6 أحرف" : "Password must be at least 6 characters"}`),

  rememberMe: z.boolean().optional(),
})


interface LoginPageProps {
  mode: "user" | "admin";
}

export default function LoginPage({ mode }: LoginPageProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const lang = useAppSelector(selectLang);
  const isRTL = lang === "ar";

  const [showPassword, setShowPassword] =
    useState(false);

  const [login, { isLoading }] =
    useLoginMutation();

  const loginSchema = createLoginSchema(isRTL);
  type LoginValues =
    z.infer<ReturnType<
      typeof createLoginSchema
    >>;

  // Remember Me email
  const rememberedEmail =
    localStorage.getItem(
      "rememberedEmail"
    ) || "";
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: rememberedEmail,
      password: "",
      rememberMe: !!rememberedEmail,
    },
  });
  // http://localhost:1337/api/customers?filters[user][id][$eq]=1&populate=*
  const onSubmit = async (
    values: LoginValues
  ) => {
    try {
      const res = await login({
        identifier: values.identifier,
        password: values.password,
      }).unwrap();
      if (values.rememberMe) {
        localStorage.setItem(
          "rememberedEmail",
          values.identifier
        );
      } else {
        localStorage.removeItem(
          "rememberedEmail"
        );
      }
      saveAuth({ token: res.jwt, userId: res.user.id, role: res.user.accountType ?? "user" });


      toast.success(
        `${isRTL ? "تم تسجيل الدخول بنجاح" : "Logged in successfully"}`
      );

      const redirectPath =
        res.user.accountType === "admin"
          ? "/admin"
          : "/";

      navigate(redirectPath, {
        replace: true,
      });

    } catch {
      toast.error(
        `${isRTL ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password"}`
      );
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {t("welcomeBack")}
          </CardTitle>

          <CardDescription>
            {t("welcomeBackContent")}
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
              name="identifier"
              control={form.control}
              render={({
                field,
                fieldState,
              }) => (
                <Field
                  data-invalid={
                    fieldState.invalid
                  }
                >
                  <FieldLabel>
                    {t("email")}
                  </FieldLabel>

                  <Input
                    {...field}
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
                <Field
                  data-invalid={
                    fieldState.invalid
                  }
                >
                  <FieldLabel>
                    {t("password")}
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
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
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
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
              name="rememberMe"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-2">
                  <Link
                    to="/forgot-password"
                    className="text-primary"
                  >
                    {t("forgotPassword")}
                  </Link>

                  <div className="flex items-center gap-2">

                    <span>
                      {t("rememberMe")}
                    </span>

                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked)
                      }
                    />
                  </div>
                </div>
              )}
            />

            <Button
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {isRTL ? "جار تسجيل الدخول..." : "Logging in..."}
                  <Spinner />
                </>
              ) : (
                <>
                  {t("login")}
                </>
              )}
            </Button>

            {mode === "user" && (
              <div className="flex items-center gap-2">
                <p>{t("dontHaveAccount")}</p>
                <Link
                  to="/register"
                  className="text-primary"
                >
                  {t("createAccount")}
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}