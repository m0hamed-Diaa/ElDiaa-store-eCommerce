import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { MessageSquare, Mail, User, Calendar } from "lucide-react";
import { getAuth } from "@/lib/authCookies";
import { useGetMessagesByUserQuery } from "@/app/messages/messagesApi";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/lib/useLocale";

const MyMessages = () => {
    const userLoggedIn = getAuth();
    const { t } = useTranslation("contact");
    const { isRTL } = useLocale();

    const userId = userLoggedIn?.userId;

    const {
        data,
        isLoading,
        isError,
    } = useGetMessagesByUserQuery(userId, {
        skip: !userId,
    });

    if (isLoading) {
        return <p className="py-8 text-center">{t("form.loading")}</p>;
    }

    if (isError) {
        return (
            <p className="py-8 text-center text-destructive">
                {t("form.messageIfError")}
            </p>
        );
    }

    const messages = data?.data ?? [];

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <MessageSquare className="mb-4 size-12 text-muted-foreground" />

                <h2 className="text-lg font-semibold">
                    {t("form.noMessagesTitle")}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    {t("form.noMessagesDescription")}
                </p>
            </div>
        );
    }

    return (
        <section className="space-y-6" dir="rtl">
            <div>
                <h1 className="text-2xl font-bold">{t("form.myMessages")}</h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    {t("form.alertMessages")}
                </p>
            </div>

            <div className="grid gap-4">
                {messages.map((item) => (
                    <Card key={item.id} className="border">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <MessageSquare className="size-5 text-primary" />
                                    {t("form.myMessage")}
                                </CardTitle>

                                <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs">
                                    {t("form.messageSend")}
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7" title={item.message}>
                                {item.message.slice(0, 200) + "..."}
                            </p>

                            <div className="grid gap-3 border-t pt-4 text-sm text-muted-foreground sm:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <User className="size-4" />
                                    <span>{item.username}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Mail className="size-4" />
                                    <span className="break-all">{item.email}</span>
                                </div>

                                {item.createdAt && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-4" />

                                        <span>
                                            {new Date(item.createdAt).toLocaleDateString(isRTL ? "ar-EG" : "en-US")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default MyMessages;