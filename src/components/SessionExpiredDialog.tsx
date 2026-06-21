import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface IProps {
    open: boolean;
    type: string;
}

export function SessionExpiredDialog({ open, type }: IProps) {

    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isRTL ? " انتهت الجلسة!" : "The session is over!"}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="rtl:text-right">
                        {isRTL ? " لأسباب أمنية تم تسجيل خروجك تلقائياً.يرجى تسجيل الدخول مرة أخرى." : "For security reasons, you were logged out automatically. Please log in again."}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogAction
                    onClick={() =>
                        window.location.href = type
                    }
                >
                    {isRTL ? "تسجيل الدخول" : "Login"}
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog >
    );
}