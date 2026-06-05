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

const schema = z.object({
    email: z
        .string()
        .email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email: values.email,
                    }),
                }
            );

            if (!res.ok)
                throw new Error();

            alert(
                "Reset password email sent successfully"
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
                        Forgot Password
                    </CardTitle>

                    <CardDescription>
                        Enter your email to receive a password reset link.
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
                                placeholder="Email"
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
                        </div>

                        <Button
                            className="w-full"
                            disabled={
                                isSubmitting
                            }
                        >
                            Send Reset Link
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}