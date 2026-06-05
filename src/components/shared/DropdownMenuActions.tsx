import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";

interface DropdownMenuActionsProps {
    id: number | string;
    deleteAction?: () => void;
    editAction?: () => void;
}

const DropdownMenuActions = ({ id, deleteAction, editAction }: DropdownMenuActionsProps) => {
    const { t } = useTranslation("adminCommon");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    return (
        <DropdownMenu key={id}>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                >
                    <ArrowUpDown size={16} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-x cursor-pointer">
                <DropdownMenuItem onClick={editAction} className={`flex items-center justify-${isRTL ? "end" : "start"}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("edit")}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={deleteAction} className={`text-destructive flex items-center justify-${isRTL ? "end" : "start"}`}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("delete")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownMenuActions
