import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocale } from "@/lib/useLocale";

interface IProps {
    openAlertDilaog: boolean;
    handleUpdateClose: () => void;
    handleUpdateConfirm: () => void;
    nextLanguage: string;
}

const AlertAdminDilaog = ({ openAlertDilaog, handleUpdateClose, handleUpdateConfirm, nextLanguage }: IProps) => {
    const { isRTL } = useLocale();
    const nextLanguageShow = nextLanguage === "ar" ? isRTL ? "العربى" : "Arabic" : isRTL ? "الانجليزى" : "English"

    return (
        <AlertDialog open={openAlertDilaog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isRTL ? `هل تريد تحديث المنتج الحالي بالإصدار ${nextLanguageShow}` : `Are you want to update current product with ${nextLanguageShow} version!`}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleUpdateClose}>{isRTL ? "اغلق" : "Cancel"}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleUpdateConfirm}
                    >
                        {isRTL ? "تعديل النسخة " : "Update"}
                    </AlertDialogAction>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog >
    )
}

export default AlertAdminDilaog;
