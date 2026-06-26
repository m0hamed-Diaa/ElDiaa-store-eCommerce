import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { selectLang } from "@/app/features/language/languageSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { openDialogAdmin } from "@/app/admin/uiDialogSlice";

interface DropdownMenuActionsProps {
    documentId: string;
    productLang: string;
    updatePath: string;
}

const DropdownMenuActions = ({ documentId, productLang, updatePath }: DropdownMenuActionsProps) => {
    const { t } = useTranslation("adminCommon");
    const lang = useAppSelector(selectLang);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isRTL = lang === "ar";

    return (
        <DropdownMenu key={documentId}>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                >
                    <ArrowUpDown size={16} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-x cursor-pointer">
                <DropdownMenuItem onClick={() => navigate(`${updatePath}${documentId}?lang=${productLang}`)} className={`flex items-center justify-${isRTL ? "end" : "start"}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("edit")}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => dispatch(openDialogAdmin())} className={`text-destructive flex items-center justify-${isRTL ? "end" : "start"}`}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("delete")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownMenuActions
