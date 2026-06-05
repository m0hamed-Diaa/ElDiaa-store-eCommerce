import { z } from "zod";
import { useSearchParams } from "react-router-dom";
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

const schema = z
    .object({
        password: z
            .string()
            .min(
                6,
                "Password must be at least 6 characters"
            ),

        confirmPassword: z.string(),
    })
    .refine(
        (data) =>
            data.password ===
            data.confirmPassword,
        {
            message:
                "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
    const [searchParams] =
        useSearchParams();

    const code =
        searchParams.get("code");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (
        values: FormValues
    ) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        code,

                        password:
                            values.password,

                        passwordConfirmation:
                            values.confirmPassword,
                    }),
                }
            );

            if (!res.ok)
                throw new Error();

            alert(
                "Password updated successfully"
            );
        } catch {
            alert("Something went wrong");
        }
    };

    return (
        <div className="container flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        Reset Password
                    </CardTitle>

                    <CardDescription>
                        Create a new password.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                        className="space-y-4"
                    >
                        <div>
                            <Input
                                type="password"
                                placeholder="New Password"
                                {...register(
                                    "password"
                                )}
                            />

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

                        <div>
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                {...register(
                                    "confirmPassword"
                                )}
                            />

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
                                isSubmitting
                            }
                        >
                            Reset Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}