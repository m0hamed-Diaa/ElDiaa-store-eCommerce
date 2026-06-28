import { z } from "zod";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectLang } from "@/app/features/language/languageSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAddCategoryTranslationMutation, useCreateCategoryMutation } from "@/app/categories/admin/categoryApi";

const createCategoryScheme =
    (isRTL: boolean) =>
        z.object({
            title: z
                .string()
                .min(
                    8,
                    isRTL
                        ? "عنوان الفئة مطلوب"
                        : "Category title is required"
                ),
        });

const CreateCategory = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("adminCategories");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    const [categoryLocale, setCategoryLocale] =
        useState<"en" | "ar">("en");

    // on open page 
    useEffect(() => {
        const pending = localStorage.getItem(
            "pendingCategoryTranslation"
        );

        if (!pending) return;

        const data = JSON.parse(pending);
        setCategoryDocumentId(data.documentId);
        setCategoryTitleEn(data.title);
        setCategoryLocale("ar");
        toast.warning(
            "أكمل الترجمة العربية للمنتج أولاً"
        );
    }, []);

    // ======================== create Product ===========================
    // First Create
    const [createCategory, { isLoading: isCategoryLoading }] =
        useCreateCategoryMutation();
    // Secound Create
    const [addCategoryTranslation, { isLoading }] =
        useAddCategoryTranslationMutation();

    const [categoryDocumentId, setCategoryDocumentId] = useState<string>("");
    const [categoryTitleEn, setCategoryTitleEn] = useState<string>("");

    const CategoryValidationScheme = createCategoryScheme(isRTL);
    type ProductValues =
        z.input<typeof CategoryValidationScheme>;

    const categoryForm = useForm<ProductValues>({
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
    } = categoryForm;

    const onSubmitCategory = async (
        values: ProductValues
    ) => {
        try {
            if (!categoryDocumentId) {

                const response =
                    await createCategory({
                        ...values,
                        locale: categoryLocale,
                    }).unwrap();

                setCategoryDocumentId(
                    response.data.documentId
                );
                setCategoryTitleEn(response.data.title);

                reset({
                    title: "",
                });

                const nextLocale =
                    categoryLocale === "en"
                        ? "ar"
                        : "en";

                setCategoryLocale(nextLocale);

                localStorage.setItem(
                    "pendingCategoryTranslation",
                    JSON.stringify({
                        documentId: response.data.documentId,
                        title: response.data.title,
                        locale: "ar",
                    })
                );

                toast.info(
                    nextLocale === "ar"
                        ? "اكتب النسخة العربية لهذة الفئة الان!"
                        : "Write English translation for this Category now!"
                );
                return;
            }

            await addCategoryTranslation({
                documentId: categoryDocumentId,

                locale: categoryLocale,

                title: values.title,

            }).unwrap();

            toast.success(
                categoryLocale === "ar"
                    ? "تم إضافة النسخة العربية"
                    : "English translation added"
            );

            reset({
                title: "",
            });

            localStorage.removeItem(
                "pendingCategoryTranslation"
            );
            setCategoryDocumentId("");
            setCategoryTitleEn("");

            setCategoryLocale("en");

            setTimeout(() => {
                navigate("/admin/categories");
            }, 1500)

        } catch (error) {
            console.log(error);
            toast.error(isRTL ? "حدث شئ خطأ، حاول مرة اخري لاحقا" : "Something went wrong, try again leter");
        }
    };

    return (
        <div className="p-4">
            <p className="font-bold">{isRTL ? "اعمل فئة جديد لربط المنتجات ببعضها" : "Create new category to concat products together"}</p>
            <div className="flex items-center justify-between">
                <p className="text-primary">{categoryLocale === "en" ?
                    isRTL ? `ملاحظة: يجب ان تعمل الفئة ب الانجليزى الاول` : `NOTE: You MUST Create Category with English first` :
                    isRTL ? `اعمل الفئة بالعربى:` : `Create category with arabic:`}
                </p>
                <Button variant={"secondary"} onClick={() => navigate("/admin/products")}>{t("backToCatePage")}</Button>
            </div>
            {categoryLocale == "ar" && (
                <p className="text-destructive mb-2">
                    {isRTL ? "لا تنسى ان تعمل الفئة بالعربى لهذا:" : "Don't forgot to create category with arabic for this:"}  "{categoryTitleEn && (categoryTitleEn)}"
                </p>
            )}
            <p>
                {categoryLocale === "en"
                    ? isRTL ? "الاصدار الانجليزى" : "English Version"
                    : isRTL ? "الاصدار العربى" : "Arabic Version"}
            </p>

            <form id="create-admin-category" className="space-y-4 mx-auto max-w-md mt-4" onSubmit={handleSubmit(onSubmitCategory)} >
                {/* title */}
                <Label htmlFor="title">{t("categoryTitle")}</Label>
                <Input
                    {...register("title")}
                    id="title"
                    placeholder={
                        categoryLocale === "en"
                            ? isRTL ? "عنوان الفئة بالانجليزى..." : "English Category title..."
                            : isRTL ? "عنوان الفئة بالعربى..." : "Arabic Category title..."
                    }
                />
                {errors.title && (
                    <p className="text-destructive text-sm">
                        {errors.title.message}
                    </p>
                )}

                <Button type="submit" fullWidth form="create-admin-category" disabled={isLoading || isCategoryLoading}>{isLoading || isCategoryLoading ? <>{isRTL ? "جار التجميل..." : "Loading..."} <Spinner /></> : `${isRTL ? "اضافة الفئة" : "Create Category"}`}</Button>
            </form >
        </div>
    )
}

export default CreateCategory;