import { toast } from "sonner";

export const validateImage = (
    file: File,
    isRTL: boolean
) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (
        !allowedTypes.includes(file.type)
    ) {
        toast.error(`${isRTL ? "مسموح بس JPG و PNG و WEBP" : "Only JPG, PNG and WEBP are allowed"}`);
        return;
    }

    if (
        file.size >
        5 * 1024 * 1024
    ) {
        toast.error(`${isRTL ? "الصورة لازم تكون أقل من ٥ ميجا" : "Image must be less than 5 MB"}`);
        return;
    }
};