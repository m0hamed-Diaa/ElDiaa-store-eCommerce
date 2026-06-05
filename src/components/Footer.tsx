
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation("common");
    return (
        <footer className="border-t p-6 text-center" >
            <p>{t("footer")}</p>
        </footer >
    )
}

export default Footer
