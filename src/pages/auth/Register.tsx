import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

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

import { toast } from "sonner";
import { useRegisterMutation } from "@/app/users/authApi";


const registerSchema = z
  .object({
    username: z.string().min(3),

    email: z.email(),

    password: z.string().min(8),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      path: ["confirmPassword"],
      message:
        "Passwords do not match",
    }
  );

type RegisterValues = z.infer<
  typeof registerSchema
>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [register, { isLoading }] =
    useRegisterMutation();

  const form =
    useForm<RegisterValues>({
      resolver:
        zodResolver(registerSchema),
    });

  const onSubmit = async (
    values: RegisterValues
  ) => {
    try {

      const { status } = await register({ username: values.username, email: values.email, password: values.confirmPassword }).unwrap();
      console.log("Register response status", status);
      toast.success(
        "Account created successfully"
      );
    } catch (err) {
      toast.error(`${err}` || "Failed to create account");
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Create Account
          </CardTitle>

          <CardDescription>
            Join our store today
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
                    Username
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
              name="email"
              control={form.control}
              render={({
                field,
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>
                    Email
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
                <Field>
                  <FieldLabel>
                    Password
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
                      className="absolute right-3 top-1/2 -translate-y-1/2"
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
                    Confirm Password
                  </FieldLabel>

                  <Input
                    {...field}
                    type="password"
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

            <Button
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}