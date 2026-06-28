import { z } from "zod";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectLang } from "@/app/features/language/languageSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetSingleCategoryQuery, useUpdateCategoryMutation } from "@/app/categories/admin/categoryApi";
import AlertAdminDilaog from "@/components/admin/AlertDilaog";

const UpdateCategorySchema =
    (isRTL: boolean) =>
        z.object({
            title: z
                .string()
                .min(
                    8,
                    isRTL
                        ? "عنوان المنتج مطلوب"
                        : "Product title is required"
                ),
        });

const UpdateCategory = () => {
    const { documentId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation("adminCategories");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    const currentCategoryLang = searchParams.get("lang") as "en" | "ar";

    console.log(currentCategoryLang);

    const { data, isLoading } =
        useGetSingleCategoryQuery({
            documentId: documentId!,
            lang: currentCategoryLang,
        });

    // on open page 
    useEffect(() => {
        if (!data?.data) return;

        const product = data.data;

        reset({
            title: product.title,
        });

    }, [data]);

    // ======================== Update Category ===========================
    const [updateCategory, { isLoading: isCategoryLoading }] =
        useUpdateCategoryMutation();

    const CategoryValidationScheme = UpdateCategorySchema(isRTL);
    type CategoryValues =
        z.input<typeof CategoryValidationScheme>;

    const CategoryForm = useForm<CategoryValues>({
        resolver: zodResolver(CategoryValidationScheme),

        defaultValues: {
            title: "",
        },
    });

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors }
    } = CategoryForm;

    // if admin want to update the second version
    const [nextLang, setNextLang] = useState<string>("");
    const [openAlertDilaog, setOpenAlertDialog] = useState<boolean>(false);
    const [updateConfirmed, setUpdateConfirmed] = useState(false);

    const onSubmitCategory = async (
        values: CategoryValues
    ) => {
        try {
            await updateCategory({
                documentId: documentId!,
                locale: currentCategoryLang,
                body: {
                    title: values.title,
                },
            }).unwrap();

            toast.success(
                currentCategoryLang === "ar"
                    ? "تم تعديل النسخة العربية"
                    : "English translation updated"
            );

            const nextLang =
                currentCategoryLang === "en"
                    ? "ar"
                    : "en";
            setNextLang(nextLang);
            if (!updateConfirmed) {
                setOpenAlertDialog(true);
                return;
            }
            setTimeout(() => navigate("/admin/categories"), 1500);

        } catch {
            toast.error(isRTL ? "حدث شئ خطأ، حاول مرة اخري لاحقا" : "Something went wrong, try again leter");
        }
    };

    const handleUpdateConfirmation = () => {
        setUpdateConfirmed(true);
        setOpenAlertDialog(false);

        navigate(`/admin/categories/update/${documentId}?lang=${nextLang}`);
    };

    const handleUpdateClose = () => {
        setOpenAlertDialog(false)

        reset({
            title: "",
        });

        setNextLang("");
        setTimeout(() => navigate("/admin/categories"), 1500);
    }

    if (isLoading) return <p className="text-primary">{isRTL ? "جار التحميل..." : "Loading..."}</p>

    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <p className="font-bold">{isRTL ? `عدل الفئة الحالية ${data?.data?.title}` : `Update current category ${data?.data?.title}`}</p>
                <Button variant={"secondary"} onClick={() => navigate("/admin/categories")}>{t("backToCatePage")}</Button>
            </div>
            <p>
                {currentCategoryLang === "en"
                    ? isRTL ? "الاصدار الانجليزى" : "English Version"
                    : isRTL ? "الاصدار العربى" : "Arabic Version"}
            </p>

            <form id="update-admin-category" className="space-y-4 mx-auto max-w-md mt-4" onSubmit={handleSubmit(onSubmitCategory)} >
                {/* title */}
                <Label htmlFor="title">{t("categoryTitle")}</Label>
                <Input
                    {...register("title")}
                    id="title"
                    placeholder={
                        currentCategoryLang === "en"
                            ? isRTL ? "عنوان الفئة بالانجليزى..." : "English Category title..."
                            : isRTL ? "عنوان الفئة بالعربى..." : "Arabic Category title..."
                    }
                />
                {errors.title && (
                    <p className="text-destructive text-sm">
                        {errors.title.message}
                    </p>
                )}

                <Button type="submit" fullWidth form="update-admin-category" disabled={isLoading || isCategoryLoading}>{isLoading || isCategoryLoading ? <>{isRTL ? "جار التجميل..." : "Loading..."} <Spinner /></> : `${isRTL ? "تعديل الفئة" : "Update Category"}`}</Button>
            </form >

            <AlertAdminDilaog openAlertDilaog={openAlertDilaog} handleUpdateClose={handleUpdateClose} handleUpdateConfirm={handleUpdateConfirmation} nextLanguage={nextLang} />
        </div >
    )
}

export default UpdateCategory;
