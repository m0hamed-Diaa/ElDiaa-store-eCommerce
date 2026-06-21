import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  ShieldCheck,
  Truck,
  Headphones,
  Smartphone,
} from "lucide-react";
import { FaShoppingBasket } from "react-icons/fa";
import { selectLang } from "@/app/features/language/languageSlice";
import { useTranslation } from "react-i18next";
import IframeMap from "@/components/IframeMap";
import { Link } from "react-router-dom";
import diaaLogo from "@/assets/diaa-logo.png";
import { usePageTitle } from "@/components/usePageTitle";

const AboutPage = () => {
  const lang = useSelector(selectLang);
  const isRTL = lang === "ar";
  const { t } = useTranslation("about");
  usePageTitle("الأعدادات | متجر الضياء للإلكترونيات", "Settings | El-diaa Store For Electronics")

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${isRTL ? "rtl text-right" : "ltr text-left"
        }`}
    >
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              {t("badge")}
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              {t("heroTitle")}
            </h1>

            <p className="mt-6 text-lg text-muted-foreground">
              {t("heroDescription")}
            </p>

            <img src={diaaLogo} className="w-full mx-auto my-4 border border-primary rounded-xl" alt={isRTL ? "صورة" : "Image"} />

            <Button
              className="rounded-xl text-white w-full md:w-fit"
            >
              <Link to={"/products"} className="flex items-center gap-2">
                {t("exploreProducts")}
                <FaShoppingBasket className="animate-bounce" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: <Smartphone size={34} />,
              key: "features.latestDevices"
            },
            {
              icon: <Truck size={34} />,
              key: "features.fastDelivery"
            },
            {
              icon: <ShieldCheck size={34} />,
              key: "features.securePayment"
            },
            {
              icon: <Headphones size={34} />,
              key: "features.support"
            },
          ].map((item, index) => (
            <Card
              key={index}
              className="rounded-3xl border-border/50 bg-card/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <CardContent className="p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {t(`${item.key}.title`)}
                </h3>

                <p className="mt-3 text-muted-foreground">
                  {t(`${item.key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="container mx-auto grid gap-10 px-6 py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black">
              {t("storyTitle")}
            </h2>

            <p className="mt-6 leading-8 text-muted-foreground">
              {t("storyDescription")}
            </p>
          </div>

          <div className="rounded-3xl border border-border/50 bg-background p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-4xl font-black text-primary">10K+</h3>
                <p className="mt-2 text-muted-foreground">
                  {t("stats.happyCustomers")}
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-primary">500+</h3>
                <p className="mt-2 text-muted-foreground">
                  {t("stats.modernProducts")}
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-primary">24/7</h3>
                <p className="mt-2 text-muted-foreground">
                  {t("stats.support")}
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-primary">99%</h3>
                <p className="mt-2 text-muted-foreground">
                  {t("stats.clientSatisfaction")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <div className="container mx-auto px-4 py-5">
        <h2 className="text-3xl font-black">
          {t("location")}
        </h2>
        <IframeMap />
      </div>
    </div>
  );
};

export default AboutPage;