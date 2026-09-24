import { useLocale } from "@/lib/useLocale";
import { Link } from "react-router-dom";

interface AppLinkProps {
    to: string;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    className?: string;
}

export function AppLink({ to, children, onClick, className, ...props }: AppLinkProps) {

    const { lang } = useLocale();

    return (
        <Link
            to={`/${lang}${to}`}
            {...props}
            onClick={onClick}
            className={className}
        >
            {children}
        </Link>
    );
}