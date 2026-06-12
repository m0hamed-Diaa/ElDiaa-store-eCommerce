import { useAppSelector } from "@/app/hooks";
import { useGetSingleProductQuery } from "@/app/products/user/productsApi";
import type { RootState } from "@/app/store";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/skeletens/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = () => {
    const { documentId } = useParams();
    const lang = useAppSelector((state: RootState) => state.language.lang);
    const isRTL = lang === "ar";
    const { data, isLoading } = useGetSingleProductQuery({ lang, documentId: documentId! })
    const product = data?.data;
    const navigate = useNavigate();
    useEffect(() => {
        if (product?.title) {
            document.title = `${product?.title}`;
        } else {
            document.title = "عنوان افتراضي";
        }
    });
    if (isLoading) {
        return (
            <div className="h-screen my-10">
                <div className="w-full sm:w-82.5 mx-auto">
                    <div className="relative h-10 w-20 mb-5 overflow-hidden rounded-xl bg-muted/40">
                        <div className="absolute inset-0 shimmer" />
                    </div>
                    <ProductCardSkeleton />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <>
                <Button className="my-10 px-4" variant={"outline"} onClick={() => { navigate(-1) }}>{isRTL ? "رجوع" : "Back"}</Button>
                <div className="flex min-h-screen items-center justify-center text-destructive">
                    {isRTL ? "المنتج غير موجود" : "Product Not Found"}
                </div>
            </>
        );
    }
    return (
        <div className="px-4 h-screen my-10">
            <div className="w-full sm:w-100 mx-auto">
                <Button className="mb-5" variant={"outline"} onClick={() => { navigate(-1) }}>{isRTL ? "رجوع" : "Back"}</Button>
                <ProductCard p={product} showActions={true} isForDetails={true} />
            </div>
        </div>
    )
}

export default ProductDetails;
