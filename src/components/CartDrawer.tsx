import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

import { Button } from "./ui/button";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    selectCartCount,
    selectCartItems,
    selectCartTotal,
} from "@/app/features/cartSlice";
import { closeCartDrawer, selectIsDrawerOpen } from "@/app/features/uiSlice";
import { selectLang } from "@/app/features/language/languageSlice";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaShoppingBasket } from "react-icons/fa";
import { DialogDemo } from "./shared/DialogDemo";


export function CartDrawer() {
    const dispatch = useAppDispatch();

    const { t } = useTranslation("common");

    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";

    const cartItems = useAppSelector(selectCartItems);

    const totalPrice = useAppSelector(selectCartTotal);
    const totalQuantity = useAppSelector(selectCartCount);

    const isOpen = useAppSelector(selectIsDrawerOpen);
    // Increase Product
    const IncreaseProduct = (id: number) => {
        dispatch(increaseQuantity(id))
        toast.success(t("increaseProduct"))
    }
    // Decrease Product
    const DecreaseProduct = (id: number) => {
        dispatch(decreaseQuantity(id))
        toast.success(t("increaseProduct"))
    }
    const [isLoading, setLoading] = useState<boolean>(false);
    // Delete Product
    const DeleteProduct = (id: number) => {
        setLoading(true);
        dispatch(removeFromCart(id))
        toast.error(t("removeProduct"));
        setLoading(false);
    }
    const CloseCartDrawer = () => {
        dispatch(closeCartDrawer());
    }

    return (
        <Drawer
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    dispatch(closeCartDrawer());
                }
            }}
            direction={isRTL ? "right" : "left"}
        >
            <DrawerContent
                className={`
                    h-screen max-w-md bg-background/95 backdrop-blur-xl
                    ${isRTL ? "mr-auto" : "mr-auto"}
                    `}
            >
                <DrawerHeader
                    className={`
                        border-b pb-4
                        ${isRTL ? "text-right" : "text-left"}
                    `}
                >

                    <DrawerTitle className={`text-2xl font-bold  ${isRTL ? "text-right" : "text-left"}`}>
                        {t("shoppingCart")}
                    </DrawerTitle>

                    <DrawerDescription className={`${isRTL ? "text-right" : "text-left"}`}>
                        {isRTL ? <>
                            {t("products")} <span className="text-primary text-md font-bold underline">{cartItems.length}</span></> :
                            <><span className="text-primary text-md font-bold underline">{cartItems.length}</span> {t("products")}</>}
                    </DrawerDescription>
                </DrawerHeader>

                {/* CART ITEMS */}
                <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden p-4 space-y-4">
                    {cartItems.length ? (
                        cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 rounded-xl border p-3"
                            >
                                <img
                                    src={item.thumbnail.formats?.thumbnail?.url}
                                    alt={item.title}
                                    className="h-20 w-20 rounded-lg object-cover"
                                />

                                <div className="flex-1">
                                    <h3 className="line-clamp-1 font-semibold">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground mt-2">
                                        {item.quantity} × {item.finalPrice} {t("EGY")}
                                    </p>
                                    <div className="mt-2 flex gap-2 items-center">
                                        <Button className="w-2 h-5" variant={"outline"} onClick={() => IncreaseProduct(item.id)}><GoPlus /></Button>
                                        {item.quantity === 1 ?
                                            <DialogDemo title={`${isRTL ? `هل تريد حذف هذا المنتج؟ ${item.title}` : `Delete this product?: ${item.title}`}`} submitButton={`${isRTL ? "حذف المنتج" : "Delete product"}`} onClick={() => DeleteProduct(item.id)} loading={isLoading}>
                                                <RiDeleteBin5Fill className="w-4 h-5 duration-300 hover:text-(--destructive-hover) cursor-pointer" />
                                            </DialogDemo>
                                            : <Button className="w-2 h-5" variant={"outline"} onClick={() => DecreaseProduct(item.id)}> <FiMinus /> </Button>}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-destructive">
                            <Button asChild onClick={CloseCartDrawer} variant={"outline"} className="mb-4">
                                <Link to="/products">
                                    {t("go")} {t("to")} {t("products")}
                                    <FaShoppingBasket className="text-white" />
                                </Link>
                            </Button>
                            <div className="flex h-[55vh] items-center justify-center text-muted-foreground">
                                {t("noProducts")}
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <DrawerFooter className="border-t">
                    <div className="flex items-center justify-between text-lg font-bold">
                        <span>{t("quantity")}</span>
                        <span>{totalQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold">
                        <span>{t("total")}</span>
                        <span>{totalPrice} {t("EGY")}</span>
                    </div>

                    <Button asChild disabled={!cartItems.length}>
                        <Link to="/checkout">
                            {t("checkout")}
                        </Link>
                    </Button>

                    <DrawerClose asChild>
                        <Button variant="outline">
                            {t("close")}
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>

        </Drawer>
    );
}