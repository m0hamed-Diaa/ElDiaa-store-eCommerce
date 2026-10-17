import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import companyLogo from "@/assets/mohamedDiaa-logo.png";
import { usePageTitle } from "@/components/usePageTitle";
import { useLocale } from "@/lib/useLocale";
import { getAuth } from "@/lib/authCookies";
import { useGetProfileQuery } from "@/app/users/profileApi";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useAddMessageMutation } from "@/app/messages/messagesApi";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import UserMessages from "@/components/UserMessages";

const createContactSchema = (isRTL: boolean) => z.object({
  username: z
    .string()
    .min(8, `${isRTL ? "يجب أن يكون اسم المستخدم على الأقل 8 أحرف" : "Username must be at least 8 characters"}`),

  email: z
    .string()
    .email(`${isRTL ? "يجب أن يكون البريد الإلكتروني صحيحًا" : "Email must be a valid email"}`),

  message: z
    .string()
    .min(80, `${isRTL ? "يجب أن يكون الرسالة على الأقل 80 حرفًا" : "Message must be at least 80 characters"}`),
})

const ContactPage = () => {
  const { isRTL } = useLocale();
  const { t } = useTranslation("contact");
  usePageTitle("التواصل | متجر الضياء للإلكترونيات", "Contact | El-diaa Store For Electronics")
  const userLoggedIn = getAuth();
  const { data } = useGetProfileQuery(userLoggedIn?.userId);

  const [addMessage, { isLoading }] =
    useAddMessageMutation();

  const ContactScheme = createContactSchema(isRTL);
  type ContactValues =
    z.infer<ReturnType<
      typeof createContactSchema
    >>;

  const form = useForm<ContactValues>({
    resolver: zodResolver(ContactScheme),
    defaultValues: {
      username: "",
      email: "",
      message: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        username: data?.username || "",
        email: data?.email || "",
        message: "",
      });
    }
  }, [data, form]);

  const onSubmit = async (
    values: ContactValues
  ) => {
    try {
      await addMessage({
        ...values,
        user: data?.id
      }).unwrap();
      toast.success(t("form.messageSuccess"));
      form.reset({
        username: data?.username || "",
        email: data?.email || "",
        message: "",
      });
    } catch {
      toast.error(t("form.messageError"));
    }
  };


  return (
    <div
      className={`min-h-screen bg-background text-foreground ${isRTL ? "rtl text-right" : "ltr text-left"
        }`}
    >
      {/* Hero */}
      <section className="border-b border-border/50">
        <div className="container mx-auto px-6 py-24">
          <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            {t("badge")}
          </span>

          <h1 className="mt-6 text-5xl font-black">
            {t("heroTitle")}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("heroDescription")}
          </p>

          <img src={companyLogo} className="w-full max-w-3xl my-4 border border-primary rounded-xl" alt={isRTL ? "صورة" : "Image"} />

        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto grid gap-10 px-6 py-20 lg:grid-cols-2">
        {/* Phone Number */}
        <Card
          className="rounded-3xl border-border/50"
        >
          <CardContent className="flex items-center gap-5 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Phone size={24} />
            </div>

            <div>
              <div className="flex items-center gap-2 font-bold">
                <h3>{t("contactInfo.phone")}:</h3>
                <h3 className="underline text-primary">+201095382588</h3>
              </div>
              <Button className="p-2 mt-2">
                <a href="tel:201095382588" className="mt-1 text-muted-foreground rtl:">
                  {t("badge")} 📞
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Email */}
        <Card
          className="rounded-3xl border-border/50"
        >
          <CardContent className="flex items-center gap-5 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail size={24} />
            </div>

            <div>
              <div className="flex items-center gap-2 font-bold">
                <h3>{t("contactInfo.email")}:</h3>
                <h3 className="underline text-primary">mohameddiaaahdahed@gmail.com</h3>
              </div>
              <Button className="p-2 mt-2">
                <a href="mailto:mohameddiaaahdahed@gmail.com" className="mt-1 text-muted-foreground rtl:">
                  {t("sendEmail")} 📩
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Location */}
        <Card
          className="rounded-3xl border-border/50"
        >
          <CardContent className="flex items-center gap-5 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail size={24} />
            </div>

            <div>
              <h3 className="font-bold mb-2">{t("contactInfo.location")}:</h3>
              <h2 className="font-bold">{isRTL ? "منيا القمح، الشرقيه، مصر." : "Minya al-Qamh, el-Sharki, Egypt."}</h2>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        {data && (
          <Card className="rounded-3xl border-border/50">
            <CardContent className="p-8">
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
                    <Field
                      data-invalid={
                        fieldState.invalid
                      }
                    >
                      <FieldLabel>
                        {t("form.fullName")}
                      </FieldLabel>

                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder={`${isRTL ? "ادخل اسم المستخدم..." : "Enter your username..."}`}
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
                    <Field
                      data-invalid={
                        fieldState.invalid
                      }
                    >
                      <FieldLabel>
                        {t("form.email")}
                      </FieldLabel>

                      <div className="relative">
                        <Input
                          {...field}
                          disabled={isLoading}
                          placeholder={`${isRTL ? "ادخل إيميلك..." : "Enter your email..."}`}
                        />
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
                  name="message"
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
                        {t("form.message")}
                      </FieldLabel>

                      <div className="relative">
                        <Textarea
                          {...field}
                          rows={5}
                          disabled={isLoading}
                          placeholder={t("form.message")}
                        />
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
                      {isRTL ? "جار إرسال الرسالة..." : "Sending message..."}
                      <Spinner />
                    </>
                  ) : (
                    <>
                      {t("form.submit")}
                    </>
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>
        )}

        {/* User Message */}
        <UserMessages />

      </section>
    </div>
  );
};

export default ContactPage;