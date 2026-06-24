import type { ReactNode } from "react";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import diaaLogo from "@/assets/diaa-logo.png";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({
    children,
}: AuthLayoutProps) {
    const { t } = useTranslation("common");

    return (
        <div
            className="
      min-h-screen
      bg-linear-to-br
      from-background
      via-muted/30
      to-background
    "
        >
            {/* Top Bar */}
            <header
                className="
        border-b
        bg-background/80
        backdrop-blur-md
        sticky
        top-0
        z-50
      "
            >
                <div
                    className="
          container
          mx-auto
          flex
          h-16
          px-4
          items-center
          justify-between
        "
                >
                    <div className="flex items-center gap-2">
                        {/* Logo */}
                        <img src={diaaLogo} className="w-12 rounded-full" alt="Logo" />
                        {t("appName")}
                    </div>


                    {/* Language */}
                    <LanguageToggle />
                </div>
            </header>

            {/* Content */}
            <main
                className="
        container
        mx-auto
        flex
        h-[84vh]
        items-center
        justify-center
        px-4
      "
            >
                {children}
            </main>

            <Footer />
        </div>
    );
}