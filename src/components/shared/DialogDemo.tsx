import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "../ui/spinner";

interface IProps {
    children: ReactNode;
    body?: ReactNode;
    title: string;
    description?: string;
    submitButton: string;
    onClick: () => void;
    loading: boolean
}

export function DialogDemo({ children, title, description, body, submitButton, onClick, loading = false }: IProps) {
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    const { t } = useTranslation("common");

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className={`sm:max-w-sm bg-background/95 backdrop-blur-xl ${isRTL
                    ? "[&>button]:left-4 [&>button]:right-auto"
                    : "[&>button]:right-4 [&>button]:left-auto"
                    }`}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    {body}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">{t("close")}</Button>
                        </DialogClose>
                        <Button type="submit" onClick={onClick} loading={loading}>{submitButton} {loading ? <Spinner /> : ""}</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
