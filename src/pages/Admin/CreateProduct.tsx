import { z } from "zod";
import { uploadSingleImage } from "@/lib/uploadImage";
import { validateImage } from "@/lib/imageValidation";
import { Textarea } from "@/components/ui/textarea";
import { useUploadFilesMutation } from "@/app/features/Upload/uploadApi";
import { useGetCategoriesQuery } from "@/app/categories/admin/categoryApi";
import { useEffect, useRef, useState } from "react";
import { useAddProductTranslationMutation, useCreateProductMutation, useGetSingleProductQuery } from "@/app/products/admin/productsApi";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

const createProductSchema =
    (isRTL: boolean) =>
        z.object({
            title: z
                .string()
                .min(
                    3,
                    isRTL
                        ? "عنوان المنتج مطلوب"
                        : "Product title is required"
                ),

            description: z
                .string()
                .min(
                    25,
                    isRTL
                        ? "وصف المنتج مطلوب"
                        : "Description is required"
                ),

            categories: z
                .array(z.string())
                .min(
                    1,
                    isRTL
                        ? "اختر قسم واحد على الأقل"
                        : "Select at least one category"
                ),

            price: z
                .coerce
                .number()
                .min(
                    1,
                    isRTL
                        ? "السعر مطلوب"
                        : "Price is required"
                ),

            stock: z
                .coerce
                .number()
                .min(
                    1,
                    isRTL
                        ? "المخزون مطلوب"
                        : "Stock is required"
                ),

            rating: z
                .coerce
                .number()
                .optional(),

            reviewCount: z
                .coerce
                .number()
                .optional(),

            discount: z
                .coerce
                .number()
                .optional(),
        });

const CreateProduct = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("adminProducts");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    const [productLocale, setProductLocale] =
        useState<"en" | "ar">("en");
    const isTraslation = productLocale === "ar";
    const { data: categories } = useGetCategoriesQuery({ lang: productLocale });

    // get Current product with en version
    const [pendingDocumentId, setPendingDocumentId] =
        useState<string | null>(null);

    // on open page 
    useEffect(() => {
        const pending = localStorage.getItem(
            "pendingProductTranslation"
        );

        if (!pending) return;

        const data = JSON.parse(pending);

        setPendingDocumentId(
            data.documentId
        );
        setProductDocumentId(data.documentId);
        setThumbnailId(data.thumbnailId);
        setProductLocale("ar");
        toast.warning(
            "أكمل الترجمة العربية للمنتج أولاً"
        );
    }, []);

    // ======================== create Product ===========================
    // First Create
    const [createProduct, { isLoading: isProductLoading }] =
        useCreateProductMutation();
    // Secound Create
    const [addProductTranslation, { isLoading }] =
        useAddProductTranslationMutation();

    const [productDocumentId, setProductDocumentId] = useState<string>("");

    const ProductValidationScheme = createProductSchema(isRTL);
    type ProductValues =
        z.input<typeof ProductValidationScheme>;

    const ProductForm = useForm<ProductValues>({
        resolver: zodResolver(ProductValidationScheme),

        defaultValues: {
            title: "",

            description: "",

            categories: [],

            price: 0,

            stock: 0,

            rating: undefined,

            reviewCount: undefined,

            discount: undefined,
        },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        reset,
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = ProductForm;


    // get current product with en version
    const {
        data: singleProduct,
    } = useGetSingleProductQuery(
        {
            documentId: pendingDocumentId!,
            lang: "en",
        },
        {
            skip: !pendingDocumentId,
        }
    );

    useEffect(() => {
        if (!singleProduct?.data) return;

        const product =
            singleProduct.data;

        reset({
            title: "",
            description: "",

            categories:
                product.categories.map(
                    (cat) =>
                        cat.documentId
                ),

            price: product.price,

            stock: product.stock,

            rating: product.rating,

            reviewCount:
                product.reviewCount,

            discount:
                product.discount,
        });

        toast.warning(
            isRTL ? "أكمل الترجمة العربية للمنتج أولاً!" : "Complete the translate of product first!"
        );
    }, [singleProduct, reset]);
    // =========== Strat Uplaod Image ==========
    const [
        uploadFiles,
        { isLoading: isUploading }
    ] = useUploadFilesMutation();

    const [thumbnailId, setThumbnailId] =
        useState<number | null>(null);

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

            setThumbnailId(imageId);

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
    const [imageError, setImageError] = useState("")
    // =========== End Uplaod Image ==========

    const onSubmitProduct = async (
        values: ProductValues
    ) => {
        if (!thumbnailId) {
            setImageError(`${isRTL ? "صورة المنتج مطلوبة" : "Product image is required"}`)
            return
        };
        try {
            if (!productDocumentId) {

                const response =
                    await createProduct({
                        ...values,
                        thumbnail: thumbnailId,
                        locale: productLocale,
                    }).unwrap();

                setProductDocumentId(
                    response.data.documentId
                );

                reset({
                    ...values,
                    title: "",
                    description: "",
                    categories: [],
                });

                const nextLocale =
                    productLocale === "en"
                        ? "ar"
                        : "en";

                setProductLocale(nextLocale);

                localStorage.setItem(
                    "pendingProductTranslation",
                    JSON.stringify({
                        documentId: response.data.documentId,
                        locale: "ar",
                        thumbnailId,
                    })
                );

                toast.info(
                    nextLocale === "ar"
                        ? "اكتب النسخة العربية لهذا المنتج الان!"
                        : "Write English translation for this product now!"
                );
                return;
            }

            await addProductTranslation({
                documentId: productDocumentId,

                locale: productLocale,

                title: values.title,
                description: values.description,

                categories: values.categories,

                thumbnail: thumbnailId,

            }).unwrap();

            toast.success(
                productLocale === "ar"
                    ? "تم إضافة النسخة العربية"
                    : "English translation added"
            );
            setThumbnailId(null);

            reset({
                title: "",
                description: "",
                categories: [],
                price: 0,
                stock: 0,
                rating: undefined,
                reviewCount: undefined,
                discount: undefined,
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            localStorage.removeItem(
                "pendingProductTranslation"
            );
            setProductDocumentId("");

            setProductLocale("en");

            setTimeout(() => {
                navigate("/admin/products");
            }, 1500)

        } catch {
            toast.error(isRTL ? "حدث شئ خطأ، حاول مرة اخري لاحقا" : "Something went wrong, try again leter");
        }
    };

    return (
        <div className="p-4">
            <p className="font-bold">{isRTL ? "اعمل منتج جديد تضيفه للمتجر" : "Create new product to store"}</p>
            <div className="flex items-center justify-between">
                <p className="text-primary">{productLocale === "en" ?
                    isRTL ? `ملاحظة: يجب ان تعمل المنتج ب الانجليزى الاول` : `NOTE: You MUST Create product with English first` :
                    isRTL ? `اعمل المنتج بالعربى:` : `Create product with arabic:`}
                </p>
                <Button variant={"secondary"} onClick={() => navigate("/admin/products")}>{t("backToProdPage")}</Button>
            </div>
            {productLocale == "ar" && (
                <p className="text-destructive mb-2">
                    {isRTL ? "لا تنسى ان تعمل المنتج بالعربى:" : "Don't forgot to create product with arabic"}
                </p>
            )}
            <p>
                {productLocale === "en"
                    ? isRTL ? "الاصدار الانجليزى" : "English Version"
                    : isRTL ? "الاصدار العربى" : "Arabic Version"}
            </p>

            <form id="create-admin-product" className="space-y-4 mx-auto max-w-md mt-4" onSubmit={handleSubmit(onSubmitProduct)} >
                {/* title */}
                <Label htmlFor="title">{t("productTitle")}</Label>
                <Input
                    {...register("title")}
                    id="title"
                    placeholder={
                        productLocale === "en"
                            ? isRTL ? "عنوان المنتج بالانجليزى..." : "English Product title..."
                            : isRTL ? "عنوان المنتج بالعربى..." : "Arabic Product title..."
                    }
                />
                {errors.title && (
                    <p className="text-destructive text-sm">
                        {errors.title.message}
                    </p>
                )}
                {/* Description */}
                <Label htmlFor="description">{t("productDescription")}</Label>
                <Textarea
                    {...register("description")}
                    id="description"
                    rows={5}
                    placeholder={
                        productLocale === "en"
                            ? isRTL ? "وصف المنتج بالانجليزى..." : "English Product description..."
                            : isRTL ? "وصف المنتج بالعربى..." : "Arabic Product description"
                    }
                />
                {errors.description && (
                    <p className="text-destructive text-sm">
                        {errors.description.message}
                    </p>
                )}
                {/* Categories */}
                <Label>{t("category")}</Label>
                <Controller
                    control={control}
                    key={productLocale}
                    name="categories"
                    render={({ field }) => (
                        <div className="space-y-2">
                            {categories?.data?.map(cat => (
                                <label
                                    key={cat.documentId}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <Checkbox
                                        checked={
                                            field.value.includes(
                                                cat.documentId
                                            )
                                        }
                                        onCheckedChange={(
                                            checked
                                        ) => {
                                            if (checked) {
                                                field.onChange([
                                                    ...field.value,
                                                    cat.documentId,
                                                ]);
                                            } else {
                                                field.onChange(
                                                    field.value.filter(
                                                        id =>
                                                            id !==
                                                            cat.documentId
                                                    )
                                                );
                                            }
                                        }}
                                    />

                                    {cat.title}
                                </label>
                            ))}
                        </div>
                    )}
                />
                {errors.categories && (
                    <p className="text-destructive text-sm">
                        {errors.categories.message}
                    </p>
                )}
                {/* Price */}
                <Label htmlFor="price">{t("productPrice")}</Label>
                <Input
                    type="number"
                    disabled={isTraslation}
                    id="price"
                    {...register("price")}
                />
                {errors.price && (
                    <p className="text-destructive text-sm">
                        {errors.price.message}
                    </p>
                )}
                {/* Stock */}
                <Label htmlFor="stock">{t("productStock")}</Label>
                <Input
                    type="number"
                    disabled={isTraslation}
                    id="stock"
                    {...register("stock")}
                />
                {errors.stock && (
                    <p className="text-destructive text-sm">
                        {errors.stock.message}
                    </p>
                )}
                {/* Rating */}
                <Label htmlFor="rating">{t("productRating")}</Label>
                <Input
                    type="number"
                    disabled={isTraslation}
                    id="rating"
                    step="0.1"
                    {...register("rating")}
                />
                {errors.rating && (
                    <p className="text-destructive text-sm">
                        {errors.rating.message}
                    </p>
                )}
                {/* ReviewCount */}
                <Label htmlFor="reviewCount">{t("productReviewCount")}</Label>
                <Input
                    type="number"
                    disabled={isTraslation}
                    id="reviewCount"
                    {...register("reviewCount")}
                />
                {errors.reviewCount && (
                    <p className="text-destructive text-sm">
                        {errors.reviewCount.message}
                    </p>
                )}
                {/* Discount */}
                <Label htmlFor="discount">{t("productDiscount")}</Label>
                <Input
                    type="number"
                    disabled={isTraslation}
                    id="discount"
                    {...register("discount")}
                />
                {errors.discount && (
                    <p className="text-destructive text-sm">
                        {errors.discount.message}
                    </p>
                )}
                {/* Image Upload */}
                <p>{t("uplaodImage")}</p>

                <Button
                    variant={"outline"}
                    fullWidth
                    className="h-15"
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    disabled={isUploading || isTraslation}
                >
                    {thumbnailId ?
                        (isRTL
                            ? "تم رفع الصورة"
                            : "Image Uploaded") : isRTL ? "اختر صورة" : "Choose Image"}
                </Button>
                {isUploading && (isRTL ? "جار التحميل..." : "Loading...")}

                <Input
                    ref={fileInputRef}
                    disabled={isUploading || isTraslation}
                    type="file"
                    accept="
                        image/jpeg,
                        image/png,
                        image/webp
                        "
                    hidden
                    onChange={handleImageChange}
                />

                {thumbnailId ? <></> :
                    <p className="text-destructive text-sm">
                        {imageError}
                    </p>
                }

                <Button type="submit" fullWidth form="create-admin-product" disabled={isLoading || isProductLoading}>{isLoading || isProductLoading ? <>{isRTL ? "جار التجميل..." : "Loading..."} <Spinner /></> : `${isRTL ? "اضافة المنتج" : "Create Product"}`}</Button>
            </form >
        </div>
    )
}

export default CreateProduct;