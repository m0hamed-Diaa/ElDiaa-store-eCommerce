import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Input,
} from "@/components/ui/input";

import {
    Label,
} from "@/components/ui/label";

import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";

import {
    Separator,
} from "@/components/ui/separator";

import {
    Button,
} from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import UserAddress from "@/components/UserAddress";
import { useGetCustomerByUserQuery } from "@/app/users/profileApi";
import CheckoutSkeleton from "@/components/skeletons/CheckoutSkeleton";
import { getAuth } from "@/lib/authCookies";
import { usePageTitle } from "@/components/usePageTitle";
import { useLocale } from "@/lib/useLocale";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { decreaseQuantity, increaseQuantity, removeFromCart, selectCartItems, selectCartTotal } from "@/app/features/cartSlice";
import { DialogDemo } from "@/components/shared/DialogDemo";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { toast } from "sonner";
import { useState } from "react";

export default function CheckoutPage() {
    const { t } = useTranslation("checkout");
    const dispatch = useAppDispatch();
    const { isRTL } = useLocale();
    usePageTitle("الدفع | متجر الضياء للإلكترونيات", "Checkout | El-diaa Store For Electronics")

    const auth = getAuth();
    const { isLoading, isError } = useGetCustomerByUserQuery(auth?.userId);
    const cartItems = useAppSelector(selectCartItems);
    // Increase Product
    const IncreaseProduct = (id: number) => {
        dispatch(increaseQuantity(id))
        toast.success(t("increaseProduct"))
    }
    // Decrease Product
    const DecreaseProduct = (id: number) => {
        dispatch(decreaseQuantity(id))
        toast.success(t("decreaseProduct"))
    }
    // Delete Product
    const [isDeleting, setDeleting] = useState<boolean>(false);
    const DeleteProduct = (id: number) => {
        setDeleting(true);
        dispatch(removeFromCart(id))
        toast.error(t("removeProduct"));
        setDeleting(false);
    }
    const totalPrice = useAppSelector(selectCartTotal);


    if (isLoading) {
        return (
            <div className="p-4">
                <CheckoutSkeleton />
            </div>
        )
    }
    if (isError) {
        return <div className="text-red-500 min-h-[90vh] flex items-center justify-center">{t("errorHandling")} {t("signInFirst")}</div>;
    }

    return (
        <div className="container mx-auto min-h-screen py-10 px-5">

            <h1 className="text-3xl font-bold mb-8">
                {t("checkout")}
            </h1>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Side */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Shipping */}
                    <UserAddress mode />

                    {/* Payment */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t("paymentMethod")}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <RadioGroup defaultValue="cash">

                                <div className={`flex items-center gap-2 ${isRTL ? "justify-start flex-row-reverse" : ""}`}>
                                    <RadioGroupItem
                                        value="cash"
                                        id="cash" className="cursor-pointer"
                                    />
                                    <Label htmlFor="cash" className="cursor-pointer">
                                        {t("cashOnDelivery")}
                                    </Label>
                                </div>

                                <div className={`flex items-center gap-2 ${isRTL ? "justify-start flex-row-reverse" : ""}`}>
                                    <RadioGroupItem
                                        value="card"
                                        id="card" className="cursor-pointer"
                                    />
                                    <Label htmlFor="card" className="cursor-pointer">
                                        {t("creditCard")}
                                    </Label>
                                </div>

                                <div className={`flex items-center gap-2 ${isRTL ? "justify-start flex-row-reverse" : ""}`}>
                                    <RadioGroupItem
                                        value="paypal"
                                        id="paypal" className="cursor-pointer"
                                    />
                                    <Label htmlFor="paypal" className="cursor-pointer">
                                        {t("payPal")}
                                    </Label>
                                </div>

                            </RadioGroup>

                        </CardContent>

                    </Card>
                </div>

                {/* Right Side */}
                <div>

                    <Card className="sticky top-4">

                        <CardHeader>
                            <CardTitle>
                                {t("orderSummary")}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            {/* PRODUCTS ITEMS */}
                            <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden p-4 space-y-4">
                                {cartItems.map((item) => (
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
                                                    <DialogDemo title={`${isRTL ? `هل تريد حذف هذا المنتج؟ ${item.title}` : `Delete this product?: ${item.title}`}`} submitButton={`${isRTL ? "حذف المنتج" : "Delete product"}`} onClick={() => DeleteProduct(item.id)} loading={isDeleting}>
                                                        <RiDeleteBin5Fill className="w-4 h-5 duration-300 hover:text-destructive cursor-pointer" />
                                                    </DialogDemo>
                                                    : <Button className="w-2 h-5" variant={"outline"} onClick={() => DecreaseProduct(item.id)}> <FiMinus /> </Button>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                            <Separator className="my-4" />

                            <div className="space-y-3">

                                <div className="flex justify-between">
                                    <span>{t("subtotal")}</span>
                                    <span>${totalPrice}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>{t("shipping")}</span>
                                    <span>$10.00</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>{t("tax")}</span>
                                    <span>${(totalPrice * 0.1)}</span>
                                </div>

                            </div>
                            {/* PRODUCTS */}

                            <Separator className="my-4" />

                            <div className="flex justify-between text-lg font-bold">
                                <span>{t("total")}</span>
                                <span>${totalPrice + 10.00 + (totalPrice * 0.1)}</span>
                            </div>

                            <div className="mt-5 flex gap-2">

                                <Input
                                    placeholder="Coupon"
                                />

                                <Button variant="outline">
                                    {t("apply")}
                                </Button>

                            </div>

                            <Button
                                size="lg"
                                className="w-full mt-6"
                            >
                                {t("placeOrder")}
                            </Button>

                        </CardContent>

                    </Card>

                </div>

            </div>

        </div >
    );
}