// src/pages/UsersPages/ContactPage.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import {
  Mail,
  Phone,
  SendHorizonal,
} from "lucide-react";
import { selectLang } from "@/app/features/language/languageSlice";
import { useTranslation } from "react-i18next";
import companyLogo from "@/assets/mohamedDiaa-logo.png";

const ContactPage = () => {
  const lang = useSelector(selectLang);
  const isRTL = lang === "ar";
  const { t } = useTranslation("contact");

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
                <a href="tel:+201095382588" className="mt-1 text-muted-foreground rtl:">
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
        <Card className="rounded-3xl border-border/50">
          <CardContent className="p-8">
            <h2 className="text-3xl font-black">
              {t("form.title")}
            </h2>

            <div className="mt-8 space-y-5">
              <Input
                placeholder={t("form.fullName")}
                className="h-12 rounded-xl"
              />

              <Input
                placeholder={t("form.email")}
                className="h-12 rounded-xl"
              />

              <Textarea
                placeholder={t("form.message")}
                className="min-h-40 rounded-xl"
              />

              <Button fullWidth>
                {isRTL ? <>
                  {t("form.submit")}
                  <SendHorizonal size={18} />
                </> :
                  <>
                    <SendHorizonal size={18} />
                    {t("form.submit")}
                  </>
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ContactPage;