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
import { useAppSelector } from "@/app/hooks";
import { selectLang } from "@/app/features/language/languageSlice";
import { useGetCustomerByUserQuery } from "@/app/users/profileApi";
import CheckoutSkeleton from "@/components/skeletons/CheckoutSkeleton";
import { getAuth } from "@/lib/authCookies";
import { usePageTitle } from "@/components/usePageTitle";

export default function CheckoutPage() {
    const { t } = useTranslation("checkout");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    usePageTitle("الدفع | متجر الضياء للإلكترونيات", "Checkout | El-diaa Store For Electronics")

    const auth = getAuth();
    const { isLoading, isError } = useGetCustomerByUserQuery(auth?.userId);
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

                            {/* Product */}
                            <div className="flex gap-3 mb-4">

                                <img
                                    src="https://placehold.co/100"
                                    className="w-20 h-20 rounded-lg object-cover"
                                />

                                <div>
                                    <h3 className="font-medium">
                                        iPhone 16 Pro Max
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        Qty: 1
                                    </p>

                                    <p className="font-semibold">
                                        $999
                                    </p>
                                </div>

                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-3">

                                <div className="flex justify-between">
                                    <span>{t("subtotal")}</span>
                                    <span>$999</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>{t("shipping")}</span>
                                    <span>$10</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>{t("tax")}</span>
                                    <span>$20</span>
                                </div>

                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between text-lg font-bold">
                                <span>{t("total")}</span>
                                <span>$1029</span>
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