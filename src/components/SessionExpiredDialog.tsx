import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import i18n from "@/lib/i18n";
interface IProps {
    open: boolean;
    type: string;
}

export function SessionExpiredDialog({ open, type }: IProps) {

    const isRTL = i18n.language === "ar";

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