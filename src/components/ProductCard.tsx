import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaStar, FaRegStar, FaHeart, FaShoppingBasket } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useTranslation } from "react-i18next";
import type { IProduct } from "@/interfaces";
import { FcViewDetails } from "react-icons/fc";
import { addToCart, selectCartItems } from "@/app/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { openCartDrawer } from "@/app/features/uiSlice";
import { toast } from "sonner";
import { selectIsHeart, toggleHeart } from "@/app/features/heartSlice";
import { Link } from "react-router-dom";
import { formatTimeAgo } from "@/utils";

interface IProps {
    p: IProduct;
    showActions: boolean;
    isForDetails?: boolean;
}

export default function ProductCard({ p, showActions = true, isForDetails = false }: IProps) {
    const cartItems = useAppSelector(selectCartItems);
    const isProductInCart = cartItems.some((item) => item.id === p.id)


    const { t } = useTranslation("products");
    const lang = useSelector((state: RootState) => state.language.lang);
    const isRTL = lang === "ar";

    const finalPrice = () => {
        return (
            p.discount
                ? (p.price - (p.price * p.discount) / 100).toFixed(2)
                : p.price
        )
    }

    const renderStars = (rating = 0) => {
        return [...Array(5)].map((_, i) =>
            i < Math.round(rating) ? (
                <FaStar key={i} />
            ) : (
                <FaRegStar key={i} />
            )
        );
    };


    const dispatch = useAppDispatch();

    // Add To Cart function 
    const AddToCart = (p: IProduct) => {
        dispatch(addToCart(p));
        toast.success(t("addProduct"))
        dispatch(openCartDrawer());
    }
    // Add To Cart function 
    const QuickAdd = (p: IProduct) => {
        toast.success(`${t("addProduct")}`);
        dispatch(addToCart(p));
    }

    // Add Heart to Product 
    const heartItems = useAppSelector(selectIsHeart);
    const isLoved = heartItems.includes(p.id);
    return (
        <Card key={p.id} className="group relative overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-2xl">
            <CardContent className="p-5">
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden rounded-xl bg-muted/40 flex items-center justify-center">
                    {/* Discount */}
                    {p.discount && (
                        <div className={`absolute top-3 z-40 rounded-full bg-red-500 px-3 py-1 text-xs text-white ${isRTL ? "right-3" : "left-3"}`}>
                            {p.discount}%
                        </div>
                    )}

                    {/* Wishlist */}
                    <button
                        onClick={() => {
                            dispatch(toggleHeart(p.id))
                            toast(isLoved ? `${t("removeWishlist")}` : `${t("addWishlist")}`)
                        }}
                        className={`absolute top-3 z-10 rounded-full bg-background/80 p-2 shadow backdrop-blur transition hover:scale-110 ${isRTL ? "left-3" : "right-3"}`}
                    >
                        <FaHeart className={isLoved ? "text-red-500" : "text-muted-foreground"} />
                    </button>
                    <img
                        src={p?.thumbnail?.url}
                        alt={p.title}
                        className={`
                            h-44 object-cover transition-transform duration-500 group-hover:scale-105
                        ${isForDetails
                                ? "h-80 w-full rounded-2xl"
                                : "h-44 rounded-full group-hover:rounded-none"
                            }
                            `}
                    />
                    {/* Hover Overlay */}
                    {isForDetails ? <></> : <>
                        <div
                            className="
                            absolute inset-0
                            opacity-100 md:opacity-0
                            flex items-center justify-center
                            bg-black/40 
                            transition duration-300
                            md:group-hover:opacity-100
                            "
                        >
                            <Button disabled={isProductInCart} className="rounded-xl shadow-lg" onClick={() => QuickAdd(p)}>
                                {isProductInCart ? <>{t("addedProduct")}</> : <>{t("quickAdd")} ⚡</>}
                            </Button>
                        </div></>}
                </div>

                {/* CONTENT */}
                <div className="mt-5 space-y-3">
                    <h3 className={`${isForDetails ? "" : "line-clamp-1"} text-lg font-semibold`}>
                        {p.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 text-yellow-500 text-sm">
                        {p.rating && (<>{renderStars(p.rating)}• ({p.rating})</>)}
                        {p.reviewCount && (<span className="text-muted-foreground">
                            {p.reviewCount} {t("reviews")}
                        </span>)}
                    </div>

                    {/* Description */}
                    <div className="min-h-10">
                        <p
                            className={`${isForDetails ? "" : "line-clamp-2"} text-sm text-muted-foreground`}
                            title={p.description}
                        >
                            {p.description}
                        </p>
                    </div>
                    {/* Price */}
                    <div className="flex items-center gap-3 pt-2">
                        {p.discount ? (
                            <>
                                <span className="text-sm line-through text-muted-foreground">
                                    <span className="text-sm">{t("EGP")}</span> {p.price}
                                </span>
                                <span className="relative text-lg font-bold text-primary">
                                    <span className="absolute -top-1 left-0 text-[10px] text-muted-foreground">
                                        {t("EGP")}
                                    </span>
                                    <span className="ml-4">
                                        {finalPrice()}
                                    </span>
                                </span>
                            </>
                        ) :
                            <>
                                <span className="relative text-lg font-bold text-primary">
                                    <span className="absolute -top-1 left-0 text-[10px] text-muted-foreground">
                                        {t("EGP")}
                                    </span>
                                    <span className="ml-4">
                                        {p.price}
                                    </span>
                                </span>
                            </>}
                        {formatTimeAgo(p.createdAt, `${lang}`)}
                    </div>
                    <div className="min-h-4">
                        {p.stock <= 10 && p.stock > 0 && (
                            <p className="text-xs text-red-500 font-medium">
                                ⚠️ {t("only")} {p.stock} {t("leftInStock")}
                            </p>
                        )}
                    </div>
                    {/* Actions */}
                    {showActions && (
                        <div className="flex items-center gap-2 pt-2">
                            <Button disabled={isProductInCart} className={`${isForDetails ? "w-full" : "w-[50%]"} rounded-xl`} onClick={() => AddToCart(p)}>
                                {isProductInCart ? <>{t("addedProduct")}</> : <>{t("addToCart")} <FaShoppingBasket className="animate-bounce text-white" />
                                </>}
                            </Button>
                            {isForDetails ? <></>
                                :
                                <Button variant="outline" className="w-[50%] rounded-xl">
                                    <Link to={`/products/${p.documentId}`} className="flex items-center gap-1">
                                        {t("viewDetails")}
                                        <FcViewDetails className="animate-pulse" />
                                    </Link>
                                </Button>
                            }
                        </div>
                    )}
                </div>
            </CardContent>
        </Card >
    )
}