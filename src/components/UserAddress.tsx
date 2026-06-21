import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";
import { useAddCustomerMutation, useGetCustomerByUserQuery, useGetProfileQuery, useUpdateCustomerMutation, useUpdateProfileMutation } from "@/app/users/profileApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getAuth } from "@/lib/authCookies";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MapPin, Phone } from "lucide-react";
import { DialogDemo } from "./shared/DialogDemo";
import { Button } from "./ui/button";
import { MdBrowserUpdated } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";



const createAddressSchema = (isRTL: boolean) =>
    z.object({
        username: z
            .string()
            .min(
                9,
                isRTL
                    ? "يجب أن تدخل اسمك كاملا صحيحا مثلا.(على احمد على)"
                    : "You should enter your true full name eg.(Ali ahmed Ali)"
            )
            .max(
                25,
                isRTL
                    ? "اسم المستخدم طويل جداً"
                    : "Username is too long"
            ),

        country: z
            .string()
            .min(
                2,
                isRTL
                    ? "يجب إدخال الدولة"
                    : "Country is required"
            )
            .max(
                50,
                isRTL
                    ? "اسم الدولة طويل جداً"
                    : "Country name is too long"
            ),

        city: z
            .string()
            .min(
                2,
                isRTL
                    ? "يجب إدخال المدينة"
                    : "City is required"
            )
            .max(
                50,
                isRTL
                    ? "اسم المدينة طويل جداً"
                    : "City name is too long"
            ),

        address: z
            .string()
            .min(
                10,
                isRTL
                    ? "العنوان قصير جداً"
                    : "Address is too short"
            )
            .max(
                200,
                isRTL
                    ? "العنوان طويل جداً"
                    : "Address is too long"
            ),

        phone: z
            .string()
            .min(
                10,
                isRTL
                    ? "رقم الهاتف غير صحيح"
                    : "Invalid phone number"
            )
            .max(
                15,
                isRTL
                    ? "رقم الهاتف غير صحيح"
                    : "Invalid phone number"
            )
            .regex(
                /^[0-9+]+$/,
                isRTL
                    ? "رقم الهاتف يجب أن يحتوى على أرقام فقط"
                    : "Phone must contain only numbers"
            ),
    });

interface IProps {
    mode?: boolean;
}
const UserAddress = ({ mode }: IProps) => {
    const { t } = useTranslation("settings");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    // User Data
    const userLoggedIn = getAuth();
    // User Profile Data
    const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useGetProfileQuery(userLoggedIn?.userId);

    // ============================== add | update Personal Address ======================

    const { data: customer, isLoading: isCustomerLoading, isError: isCustomerError } = useGetCustomerByUserQuery(userLoggedIn?.userId);

    const [openAddress, setOpenAddress] = useState<boolean>(false);

    const [
        addCustomer,
        { isLoading: isAddingAddress }
    ] = useAddCustomerMutation();

    const [updateCustomer, { isLoading: isLoadingAddress }] =
        useUpdateCustomerMutation();

    const [updateProfile, { isLoading }] =
        useUpdateProfileMutation();

    const AddressValidationScheme = createAddressSchema(isRTL);
    type AddressValues =
        z.infer<typeof AddressValidationScheme>;

    const addressForm = useForm<AddressValues>({
        resolver: zodResolver(AddressValidationScheme),

        defaultValues: {
            username: profile?.username || customer?.username,
            country: "",
            city: "",
            address: "",
            phone: "",
        },
    });

    const {
        reset: resetAddress,
        register: registerAddress,
        handleSubmit: handleSubmitAddress,

        formState: { errors: addressErrors }
    } = addressForm;

    useEffect(() => {
        if (customer?.documentId) {
            resetAddress({
                username:
                    profile?.username || customer?.username,

                country:
                    customer?.address ?? "",

                city:
                    customer?.city ?? "",

                address:
                    customer?.address ?? "",

                phone:
                    customer?.phone ?? "",
            });
        }
    }, [customer, resetAddress]);

    const onSubmitAddress = async (
        values: AddressValues
    ) => {
        try {
            if (
                customer?.documentId
            ) {
                await updateCustomer({
                    documentId:
                        customer?.documentId,

                    body: values,
                }).unwrap();

            } else {
                await addCustomer({
                    ...values,
                    user: profile?.id
                }).unwrap();
            }
            await updateProfile({
                id: profile?.id,
                body: {
                    username: values.username
                },
            }).unwrap();
            setOpenAddress(false);

            toast.success(
                customer?.id
                    ? `${isRTL ? "تم تحديث العنوان الشخصي بنجاح" : "Personal Address updated successfully"}`
                    : `${isRTL ? "تم إضافة العنوان الشخصي بنجاح" : "Personal Address created successfully"}`
            );


        } catch (error: any) {
            console.log(error?.data);
            toast.error(
                customer?.id
                    ? `${isRTL ? "فشل في تحديث العنوان الشخصى" : "Failed to update Personal Address"}`
                    : `${isRTL ? "فشل في إضافة العنوان الشخصى" : "Failed to create Personal Address"}`
            );
        }
    };
    if (isCustomerLoading || isProfileLoading) {
        return (
            <div className="p-4">
                {isRTL ? "جار التحميل..." : "Loading..."}
            </div>
        )
    }
    if (isCustomerError || isProfileError) {
        return <div className="text-red-500 min-h-[90vh] flex items-center justify-center">{t("errorHandling")}</div>;
    }

    return (
        <Card className="relative">
            <CardHeader className="mb-4">
                <CardTitle>
                    {mode ? (<>{t("shippingAdd")}</>) : <>{t("addressInfo")}</>}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">

                <div className="flex items-center gap-3">
                    <MapPin size={18} />
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {t("userFullName")}
                        </p>
                        <p className="font-medium">
                            {profile?.username || "-"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <MapPin size={18} />
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {t("country")}
                        </p>
                        <p className="font-medium">
                            {customer?.country || "-"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <MapPin size={18} />
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {t("city")}
                        </p>
                        <p className="font-medium">
                            {customer?.city || "-"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <MapPin size={18} />
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {t("homeAddress")}
                        </p>
                        <p className="font-medium">
                            {customer?.address || "-"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Phone size={18} />
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {t("phone")}
                        </p>
                        <p className="font-medium">
                            {customer?.phone || "-"}
                        </p>
                    </div>
                </div>
            </CardContent>
            <DialogDemo open={openAddress} setOpen={setOpenAddress} formId="update-profile-address" children={customer?.id ? <Button className={`m-2.5 w-[96%] md:w-fit md:absolute top-1 ${isRTL ? "left-1" : "right-1"}`}>
                {t("update")} {t("addressInfo")} <MdBrowserUpdated />
            </Button> :
                <Button className={`m-2.5 w-[96%] md:w-fit md:absolute top-1 ${isRTL ? "left-1" : "right-1"}`}>
                    {t("addedNewAddress")} <FaAddressCard />
                </Button>} title={customer?.id ? `${t("updateProfile")} ` : `${t("addNewAddressInfo")} `} submitButton={isRTL ? "احفظ التغيرات" : "Save changes"} loading={isLoadingAddress ? isLoadingAddress : isAddingAddress} body={
                    <form id="update-profile-address" onSubmit={handleSubmitAddress(onSubmitAddress)} className="space-y-4" >
                        <Input disabled={isLoading || isLoadingAddress} {...registerAddress("username")} placeholder={t("userFullName") + "..."} />
                        {addressErrors.username && (
                            <p className="text-destructive text-sm">
                                {addressErrors.username.message}
                            </p>
                        )}

                        <Input disabled={isLoading || isLoadingAddress} {...registerAddress("phone")} placeholder={t("phone") + "..."} />
                        {addressErrors.phone && (
                            <p className="text-destructive text-sm">
                                {addressErrors.phone.message}
                            </p>
                        )}
                        <Input disabled={isLoading || isLoadingAddress} {...registerAddress("country")} placeholder={t("country") + "..."} />
                        {addressErrors.country && (
                            <p className="text-destructive text-sm">
                                {addressErrors.country.message}
                            </p>
                        )}
                        <Input disabled={isLoading || isLoadingAddress} {...registerAddress("city")} placeholder={t("city") + "..."} />
                        {addressErrors.city && (
                            <p className="text-destructive text-sm">
                                {addressErrors.city.message}
                            </p>
                        )}
                        <Textarea disabled={isLoading || isLoadingAddress} {...registerAddress("address")} placeholder={t("homeAddress") + "..."} className="resize-none max-h-5" />
                        {addressErrors.address && (
                            <p className="text-destructive text-sm">
                                {addressErrors.address.message}
                            </p>
                        )}
                    </form>
                } />
        </Card>
    )
}

export default UserAddress
