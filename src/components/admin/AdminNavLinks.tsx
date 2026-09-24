import {
    NavLink,
    type NavLinkProps,
    type To,
} from "react-router-dom";

import { useLocale } from "@/lib/useLocale";

type Props = Omit<NavLinkProps, "to"> & {
    to: To;
};

export default function AdminNavLinks({
    to,
    ...props
}: Props) {
    const { lang } = useLocale();

    return (
        <NavLink
            {...props}
            to={
                typeof to === "string"
                    ? `/${lang}${to}`
                    : to
            }
        />
    );
}