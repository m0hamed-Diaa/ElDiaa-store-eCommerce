import { uploadSingleImage } from "@/lib/uploadImage";
import { validateImage } from "@/lib/imageValidation";
import { Textarea } from "@/components/ui/textarea";
import { useUploadFilesMutation } from "@/app/features/Upload/uploadApi";
import { useGetCategoriesQuery } from "@/app/categories/admin/categoryApi";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectLang } from "@/app/features/language/languageSlice";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { bannerLinkTypes } from "@/lib/BannerTypes";
import { useAddHeroSlideTranslationMutation, useCreateHeroSlideMutation, useGetSingleHeroSlideQuery } from "@/app/hero-slides/admin/heroSlice";
import { useGetProductsQuery } from "@/app/products/user/productsApi";

export const createBannerSchema = (isRTL: boolean) =>
    z
        .object({
            title: z
                .string()
                .trim()
                .min(
                    5,
                    isRTL
                        ? "عنوان البانر قصير جداً"
                        : "Banner title is too short"
                )
                .max(
                    80,
                    isRTL
                        ? "عنوان البانر طويل جداً"
                        : "Banner title is too long"
                ),

            subtitle: z
                .string()
                .trim()
                .max(
                    250,
                    isRTL
                        ? "الوصف طويل جداً"
                        : "Subtitle is too long"
                )
                .optional()
                .or(z.literal("")),

            image: z.preprocess(
                (value) => value ?? 0,
                z.number().min(
                    1,
                    isRTL
                        ? "الصورة مطلوبة"
                        : "Banner image is required"
                )
            ),

            linkType: z.enum(bannerLinkTypes, {
                message: isRTL
                    ? "اختر نوع الرابط"
                    : "Choose link type",
            }),

            category: z.string().optional(),
            product: z.string().optional(),

            customUrl: z
                .string()
                .trim()
                .optional()
                .or(z.literal("")),

            discount: z
                .coerce
                .number()
                .min(0)
                .max(100)
                .optional(),
        })

        .superRefine((data, ctx) => {

            switch (data.linkType) {

                case "category":
                    if (!data.category) {
                        ctx.addIssue({
                            code: "custom",
                            path: ["category"],
                            message: isRTL
                                ? "اختر القسم"
                                : "Please select a category",
                        });
                    }
                    break;

                case "discount":
                    if (
                        data.discount == null ||
                        Number.isNaN(data.discount) ||
                        data.discount < 0 ||
                        data.discount > 100
                    ) {
                        ctx.addIssue({
                            code: "custom",
                            path: ["discount"],
                            message: isRTL
                                ? "ادخل خصمًا بين 0 و100"
                                : "Discount must be between 0 and 100",
                        });
                    }
                    break;

                case "custom":
                    if (!data.customUrl?.trim()) {
                        ctx.addIssue({
                            code: "custom",
                            path: ["customUrl"],
                            message: isRTL
                                ? "الرابط مطلوب"
                                : "Custom URL is required",
                        });
                    }
                    break;
                case "product":

                    if (
                        data.linkType === "product" &&
                        !data.product
                    ) {
                        ctx.addIssue({
                            code: "custom",
                            path: ["product"],
                            message: isRTL
                                ? "اختر منتجاً"
                                : "Please select a product",
                        });
                    }
                    break;
            }
        });

const CreateBanner = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("adminHeroSlides");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    const [bannerLocale, setProductLocale] =
        useState<"en" | "ar">("en");
    const isTranslation = bannerLocale === "ar";
    const { data: categories } = useGetCategoriesQuery({ lang: bannerLocale });
    // Get Products
    const { data: products, error: isProductsError, isLoading: isProductsLoading } = useGetProductsQuery({ lang: bannerLocale });

    // get Current product with en version
    const [pendingDocumentId, setPendingDocumentId] =
        useState<string | null>(null);

    // on open page 
    useEffect(() => {
        const pending = localStorage.getItem(
            "pendingBannerTranslation"
        );

        if (!pending) return;

        const data = JSON.parse(pending);

        setPendingDocumentId(
            data.documentId
        );
        setProductDocumentId(data.documentId);
        setProductLocale("ar");
        toast.warning(
            "أكمل الترجمة العربية للبنر أولاً"
        );
    }, []);

    // ======================== create Banner ===========================
    // First Create
    const [createBanner, { isLoading: isBannerLoading }] =
        useCreateHeroSlideMutation();
    // Secound Create
    const [addBannerTranslation, { isLoading }] =
        useAddHeroSlideTranslationMutation();

    const [productDocumentId, setProductDocumentId] = useState<string>("");

    const BannerValidationScheme = createBannerSchema(isRTL);
    type BannerValues =
        z.input<typeof BannerValidationScheme>;

    const BannerForm = useForm<BannerValues>({
        resolver: zodResolver(BannerValidationScheme),

        defaultValues: {
            title: "",
            subtitle: "",
            image: 0,
            category: "",
            linkType: undefined,
            customUrl: "",
            discount: 0,
        },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        reset,
        register,
        handleSubmit,
        control,
        setValue,
        clearErrors,
        watch,
        formState: { errors }
    } = BannerForm;

    // get current product with en version
    const {
        data: singleBanner,
    } = useGetSingleHeroSlideQuery(
        {
            documentId: pendingDocumentId!,
            lang: "en",
        },
        {
            skip: !pendingDocumentId,
        }
    );

    useEffect(() => {
        const banner = singleBanner?.data;
        if (!banner) return;

        reset({
            title: "",
            subtitle: "",
            image: banner?.image?.id ?? 0,
            category: banner?.category?.documentId ?? "",
            linkType: banner?.linkType,
            discount: banner?.discount ?? undefined,
            customUrl: banner?.customUrl ?? "",
        });

        toast.warning(
            isRTL ? "أكمل الترجمة العربية للبنر أولاً!" : "Complete the translate of banner first!"
        );
    }, [singleBanner, reset]);
    // =========== Strat Uplaod Image ==========
    const [
        uploadFiles,
        { isLoading: isUploading }
    ] = useUploadFilesMutation();

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        validateImage(file, isRTL);

        try {
            const imageId =
                await uploadSingleImage(
                    file,
                    uploadFiles
                );

            if (!imageId) {
                toast.error(
                    isRTL
                        ? "فشل رفع الصورة"
                        : "Failed to upload image"
                );

                return;
            }

            setValue("image", imageId, {
                shouldValidate: true,
            });

            clearErrors("image");

            toast.success(
                isRTL
                    ? "تم رفع الصورة"
                    : "Image uploaded"
            );
        } catch {
            toast.error(
                isRTL
                    ? "فشل رفع الصورة"
                    : "Failed to upload image"
            );
        }
    };
    // =========== End Uplaod Image ==========

    const linkType = watch("linkType");
    const imageId = watch("image");

    // save current banner name with en version
    const [saveBannerName, setSaveBannerName] = useState<string>("");

    const onSubmitBanner = async (
        values: BannerValues
    ) => {
        try {
            if (!productDocumentId) {

                const response =
                    await createBanner({
                        ...values,
                        locale: bannerLocale,
                    }).unwrap();

                setProductDocumentId(
                    response.data.documentId
                );

                reset({
                    ...values,
                    title: "",
                    subtitle: "",
                });

                const nextLocale =
                    bannerLocale === "en"
                        ? "ar"
                        : "en";

                setProductLocale(nextLocale);
                setSaveBannerName(response.data.title);

                localStorage.setItem(
                    "pendingBannerTranslation",
                    JSON.stringify({
                        documentId: response.data.documentId,
                        locale: "ar",
                    })
                );


                toast.info(
                    nextLocale === "ar"
                        ? "اكتب النسخة العربية لهذا البنر الان!"
                        : "Write English translation for this banner now!"
                );
                return;
            }
            console.log("pr", values.title, values.subtitle, productDocumentId, bannerLocale)
            await addBannerTranslation({
                documentId: productDocumentId,

                locale: bannerLocale,

                title: values.title,
                subtitle: values.subtitle,
                image: imageId,
            }).unwrap();

            toast.success(
                bannerLocale === "ar"
                    ? "تم إضافة النسخة العربية"
                    : "English translation added"
            );

            reset({
                title: "",
                subtitle: "",
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            localStorage.removeItem(
                "pendingBannerTranslation"
            );
            setProductDocumentId("");
            setSaveBannerName("");

            setProductLocale("en");

            setTimeout(() => {
                navigate("/admin/hero-slides");
            }, 1500)

        } catch (error) {
            console.log(error);
            toast.error(isRTL ? "حدث شئ خطأ، حاول مرة اخري لاحقا" : "Something went wrong, try again leter");
        }
    };

    return (
        <div className="p-4">
            <p className="font-bold">{isRTL ? "اعمل بانر جديد تضيفه للمتجر" : "Create new banner to store"}</p>
            <div className="flex items-center justify-between">
                <p className="text-primary">{bannerLocale === "en" ?
                    isRTL ? `ملاحظة: يجب ان تعمل البانر ب الانجليزى الاول` : `NOTE: You MUST Create banner with English first` :
                    isRTL ? `اعمل البانر بالعربى:` : `Create banner with arabic:`}
                </p>
                <Button variant={"secondary"} onClick={() => navigate("/admin/hero-slides")}>{t("backToBannerPage")}</Button>
            </div>
            {bannerLocale == "ar" && (
                <p className="text-destructive mb-2">
                    {isRTL ? `لا تنسى ان تعمل البنر بالعربى: ${singleBanner?.data?.title || saveBannerName}` : `Don't forgot to create banner with arabic ${singleBanner?.data?.title || saveBannerName}`}
                </p>
            )}
            <p>
                {bannerLocale === "en"
                    ? isRTL ? "الاصدار الانجليزى" : "English Version"
                    : isRTL ? "الاصدار العربى" : "Arabic Version"}
            </p>

            <form id="create-admin-banner" className="space-y-4 mx-auto max-w-md mt-4" onSubmit={handleSubmit(onSubmitBanner)} >
                {/* title */}
                <Label htmlFor="title">{t("bannerTitle")}</Label>
                <Input
                    {...register("title")}
                    id="title"
                    placeholder={
                        bannerLocale === "en"
                            ? isRTL ? "عنوان البانر بالانجليزى..." : "English Banner title..."
                            : isRTL ? "عنوان البانر بالعربى..." : "Arabic Banner title..."
                    }
                />
                {errors.title && (
                    <p className="text-destructive text-sm">
                        {errors.title.message}
                    </p>
                )}
                {/* Description */}
                <Label htmlFor="subtitle">{t("bannerSubtitle")}</Label>
                <Textarea
                    {...register("subtitle")}
                    id="subtitle"
                    rows={5}
                    placeholder={
                        bannerLocale === "en"
                            ? isRTL ? "عنوان البانر بالانجليزى..." : "English Banner subtitle..."
                            : isRTL ? "عنوان البانر بالعربى..." : "Arabic Banner subtitle..."
                    }
                />
                {errors.subtitle && (
                    <p className="text-destructive text-sm">
                        {errors.subtitle.message}
                    </p>
                )}



                {!isTranslation && (
                    <>
                        {/* Image Upload */}
                        <p>{t("uploadImage")}</p>
                        <Card
                            onClick={() => {
                                if (imageId || isTranslation) return;
                                fileInputRef.current?.click()
                            }
                            }
                            className="
                            cursor-pointer
                            border-dashed
                            flex
                            items-center
                            justify-center
                            h-56
                        "
                        >
                            {imageId ? (
                                <span className="flex items-center">
                                    <ImageIcon className="mr-2 h-5 w-5" />

                                    {isRTL
                                        ? "تم رفع الصورة"
                                        : "Image Uploaded"}
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Plus className="mr-2 h-5 w-5" />

                                    {isRTL
                                        ? "اختر صورة"
                                        : "Choose Image"}
                                </span>
                            )}
                        </Card>
                        {isUploading && (isRTL ? "جار التحميل..." : "Loading...")}

                        {errors.image && (
                            <p className="text-destructive text-sm">
                                {errors.image.message}
                            </p>
                        )}
                        <Input
                            ref={fileInputRef}
                            disabled={isUploading || isTranslation}
                            type="file"
                            accept="
                            image/jpeg,
                            image/png,
                            image/webp
                            "
                            hidden
                            onChange={handleImageChange}
                        />
                        {/* Link Type selection */}
                        <Controller
                            control={control}
                            name="linkType"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isTranslation}
                                >

                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={t("choose")}
                                        />
                                    </SelectTrigger>

                                    <SelectContent className="bg-primary text-primary-foreground">
                                        {bannerLinkTypes.map((type) => (
                                            <SelectItem
                                                key={type}
                                                value={type}
                                            >
                                                {t(type)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>

                                </Select>

                            )}
                        />
                        {errors.linkType && (
                            <p className="text-destructive">
                                {errors.linkType.message}
                            </p>
                        )}
                        {/* Categories */}
                        {linkType === "category" && (
                            <>
                                <Label>{t("categoryChoose")}</Label>
                                <Controller
                                    control={control}
                                    name="category"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("category")} />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {categories?.data?.map((cat) => (
                                                    <SelectItem
                                                        key={cat.documentId}
                                                        value={cat.documentId}
                                                    >
                                                        {cat.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.category && (
                                    <p className="text-destructive text-sm">
                                        {errors.category.message}
                                    </p>
                                )}
                            </>
                        )}
                        {/* Product */}
                        {linkType === "product" && (
                            <>
                                <Label>{t("product")}</Label>

                                <Controller
                                    control={control}
                                    name="product"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t("chooseProduct")}
                                                />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {isProductsLoading || isProductsError ? (
                                                    <p className="text-center">{t("loading")}</p>
                                                ) : products?.data.length ? products?.data.map(product => (

                                                    <SelectItem
                                                        key={product.documentId}
                                                        value={product.documentId}
                                                    >
                                                        {product.title}
                                                    </SelectItem>

                                                )) : <p className="text-center text-destructive">{t("noProducts")}</p>}

                                            </SelectContent>

                                        </Select>
                                    )}
                                />

                                {errors.product && (
                                    <p className="text-destructive text-sm">
                                        {errors.product.message}
                                    </p>
                                )}
                            </>
                        )}
                        {/* Discount */}
                        {linkType === "discount" && (

                            <Input

                                type="number"

                                {...register("discount")}

                            />

                        )}
                        {/* Custom URL */}
                        {linkType === "custom" && (

                            <Input

                                placeholder="https://..."

                                {...register("customUrl")}

                            />

                        )}</>
                )}
                <Button type="submit" fullWidth form="create-admin-banner" disabled={isLoading || isUploading || isBannerLoading}>{isLoading || isUploading || isBannerLoading ? <>{isRTL ? "جار التجميل..." : "Loading..."} <Spinner /></> : `${isRTL ? "اضافة البانر" : "Create Banner"}`}</Button>
            </form >
        </div>
    )
}

export default CreateBanner;