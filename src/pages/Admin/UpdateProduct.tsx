import { z } from "zod";
import { uploadSingleImage } from "@/lib/uploadImage";
import { validateImage } from "@/lib/imageValidation";
import { Textarea } from "@/components/ui/textarea";
import { useUploadFilesMutation } from "@/app/features/Upload/uploadApi";
import { useGetCategoriesQuery } from "@/app/categories/admin/categoryApi";
import { useEffect, useRef, useState } from "react";
import { useGetSingleProductQuery, useUpdateProductMutation } from "@/app/products/admin/productsApi";
import { useAppSelector } from "@/app/hooks";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import AlertAdminDilaog from "@/components/admin/AlertDilaog";

const UpdateProductSchema =
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

const UpdateProduct = () => {
    const { documentId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation("adminProducts");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";

    const currentProductLang =
        searchParams.get("lang") as "en" | "ar";

    const { data, isLoading } =
        useGetSingleProductQuery({
            documentId: documentId!,
            lang: currentProductLang,
        });

    const { data: categories } = useGetCategoriesQuery({ lang: currentProductLang });


    // on open page 
    useEffect(() => {
        if (!data?.data) return;

        const product = data.data;

        reset({
            title: product.title,
            description: product.description,
            categories: product.categories.map(
                c => c.documentId
            ),
            price: product.price,
            stock: product.stock,
            rating: product.rating,
            reviewCount: product.reviewCount,
            discount: product.discount,
        });

        setThumbnailId(product.thumbnail.id);
    }, [data]);

    // ======================== Update Product ===========================
    const [updateProduct, { isLoading: isProductLoading }] =
        useUpdateProductMutation();

    const ProductValidationScheme = UpdateProductSchema(isRTL);
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

    // if admin want to update the second version
    const [nextLang, setNextLang] = useState<string>("");
    const [openAlertDilaog, setOpenAlertDialog] = useState<boolean>(false);
    const [updateConfirmed, setUpdateConfirmed] = useState(false);

    const onSubmitProduct = async (
        values: ProductValues
    ) => {
        if (!thumbnailId) {
            setImageError(`${isRTL ? "صورة المنتج مطلوبة" : "Product image is required"}`)
            return
        };
        try {
            await updateProduct({
                documentId: documentId!,
                locale: currentProductLang,
                body: {

                    title: values.title,
                    description: values.description,

                    categories: values.categories,

                    thumbnail: thumbnailId,

                    price: values.price,
                    stock: values.stock,
                    rating: values.rating,
                    reviewCount: values.reviewCount,
                    discount: values.discount,
                },
            }).unwrap();

            toast.success(
                currentProductLang === "ar"
                    ? "تم تعديل النسخة العربية"
                    : "English translation updated"
            );

            const nextLang =
                currentProductLang === "en"
                    ? "ar"
                    : "en";
            setNextLang(nextLang);
            if (!updateConfirmed) {
                setOpenAlertDialog(true);
                return;
            }
            setTimeout(() => navigate("/admin/products"), 1500);

        } catch {
            toast.error(isRTL ? "حدث شئ خطأ، حاول مرة اخري لاحقا" : "Something went wrong, try again leter");
        }
    };

    const handleUpdateConfirmation = () => {
        setUpdateConfirmed(true);
        setOpenAlertDialog(false);

        navigate(`/admin/products/update/${documentId}?lang=${nextLang}`);
    };

    const handleUpdateClose = () => {
        setOpenAlertDialog(false)

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        reset({
            title: "",
            description: "",
            categories: [],
            price: 0,
            stock: 0,
            rating: undefined,
            reviewCount: undefined,
            discount: undefined
        });

        setNextLang("");
        setTimeout(() => navigate("/admin/products"), 1500);
    }

    if (isLoading) return <p className="text-primary">{isRTL ? "جار التحميل..." : "Loading..."}</p>

    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <p className="font-bold">{isRTL ? `عدل المنتج الحالى ${data?.data?.title}` : `Update current product ${data?.data?.title}`}</p>
                <Button variant={"secondary"} onClick={() => navigate("/admin/products")}>{t("backToProdPage")}</Button>
            </div>
            <p>
                {currentProductLang === "en"
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
                        currentProductLang === "en"
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
                        currentProductLang === "en"
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
                    name="categories"
                    render={({ field }) => (
                        <div className="space-y-2">
                            {categories?.data?.map((cat) => (
                                <label
                                    key={cat.documentId}
                                    className="flex items-center gap-2"
                                >
                                    <Checkbox
                                        checked={field.value.includes(cat.documentId)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                field.onChange([
                                                    ...field.value,
                                                    cat.documentId,
                                                ]);
                                            } else {
                                                field.onChange(
                                                    field.value.filter(
                                                        (id) => id !== cat.documentId
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
                    disabled={isUploading}
                >
                    {thumbnailId ?
                        (isRTL
                            ? "تم رفع الصورة"
                            : "Image Uploaded") : isRTL ? "اختر صورة" : "Choose Image"}
                </Button>
                {isUploading && (isRTL ? "جار التحميل..." : "Loading...")}

                <Input
                    ref={fileInputRef}
                    disabled={isUploading}
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

                <Button type="submit" fullWidth form="create-admin-product" disabled={isProductLoading || isUploading}>{isProductLoading || isUploading ? <>{isRTL ? "جار التجميل..." : "Loading..."} <Spinner /></> : `${isRTL ? "تعديل المنتج" : "Update Product"}`}</Button>
            </form >

            <AlertAdminDilaog openAlertDilaog={openAlertDilaog} handleUpdateClose={handleUpdateClose} handleUpdateConfirm={handleUpdateConfirmation} nextLanguage={nextLang} />
        </div >
    )
}

export default UpdateProduct;
