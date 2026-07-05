import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, User, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getAuth } from "@/lib/authCookies";
import { useGetCustomerByUserQuery, useGetProfileQuery, useUpdateCustomerMutation, useUpdateProfileMutation } from "@/app/users/profileApi";
import UserProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoPerson } from "react-icons/go";
import { MdBrowserUpdated } from "react-icons/md";
import { DialogDemo } from "@/components/shared/DialogDemo";
import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { validateImage } from "@/lib/imageValidation";
import { useUploadFilesMutation } from "@/app/features/Upload/uploadApi";
import { uploadSingleImage } from "@/lib/uploadImage";
import UserAddress from "@/components/UserAddress";
import { Link } from "react-router-dom";
import { FaExchangeAlt } from "react-icons/fa";
import { usePageTitle } from "@/components/usePageTitle";

const createProfileSchema = (isRTL: boolean) => z.object({
  username: z
    .string()
    .min(3, `${isRTL ? "يجب أن يحتوى الأسم على 3 أحرف على الأقل" : "Name must be at least 3 characters"}`)
    .max(50, `${isRTL ? "الأسم طويل زيادة" : "Name is too long"}`),

  email: z
    .email(`${isRTL ? "عنوان الإيميل غلط" : "Invalid email address"}`),
});


export default function ProfilePage() {
  const { t } = useTranslation("settings");
  const lang = useAppSelector(selectLang);
  const isRTL = lang === "ar";
  // Title name
  usePageTitle(
    "الملف الشخصى",
    "Profile"
  );

  // User Data
  const userLoggedIn = getAuth();
  // ============================== update Personal Information =============================
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useGetProfileQuery(userLoggedIn?.userId);
  const isAdmin = profile?.accountType === "admin";
  const changePasswordPath = isAdmin ? "/admin/settings/profile/change-password" : "/settings/profile/change-password"

  const name = profile?.username || `${isRTL ? "غيرمتاح" : "undefiend"} `;
  const parts = name.trim().split(" ");

  const firstN = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  const lastN = parts[parts.length - 1];
  const middleN = parts.slice(1, -1).join(" ");

  // Close Dialog
  const [open, setOpen] = useState<boolean>(false);
  const [updateProfile, { isLoading }] =
    useUpdateProfileMutation();
  const ProfileValidationScheme = createProfileSchema(isRTL);
  type ProfileValues =
    z.infer<ReturnType<
      typeof createProfileSchema
    >>;

  const form = useForm<ProfileValues>({
    resolver: zodResolver(ProfileValidationScheme),

    defaultValues: {
      username: "",
      email: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username ?? "",
        email: profile.email ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (
    values: ProfileValues
  ) => {
    try {
      await updateProfile({
        id: profile?.id,
        body: values,
      }).unwrap();

      toast.success(`${isRTL ? "تم تحديث الملف الشخصي بنجاح" : "Profile updated successfully"}`);

      setOpen(false);
    } catch {
      toast.error(`${isRTL ? "فشل في تحديث البروفايل" : "Failed to update profile"}`);
    }
  };

  const { data: customer } = useGetCustomerByUserQuery(userLoggedIn?.userId);

  const [updateCustomer, { isLoading: isLoadingAddress }] =
    useUpdateCustomerMutation();

  // ===================== update | create profile image =========================
  const [
    uploadFiles,
    { isLoading: isUploading }
  ] = useUploadFilesMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    validateImage(file, isRTL);

    try {
      const avatarId =
        await uploadSingleImage(
          file,
          uploadFiles
        );

      if (!avatarId) {
        toast.error(`${isRTL ? "فشل فى رفع الصورة" : "Failed to upload image"}`);
        return;
      }

      await updateCustomer({
        documentId:
          customer?.documentId,

        body: {
          avater: avatarId,
        },
      }).unwrap();

      toast.success(
        isRTL
          ? "تم تحديث الصورة"
          : "Profile image updated"
      );
    } catch (error) {
      toast.error(
        isRTL
          ? "فشل رفع الصورة"
          : "Failed to upload image"
      );
    }
  };

  // ========== Multi Images ==============
  // const fileInputRef = useRef<HTMLInputElement>(null);

  //   const handleProductImages = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const selectedFiles = Array.from(
  //     e.target.files || []
  //   );

  //   if (!selectedFiles.length) return;

  //   const imageIds =
  //     await uploadMultiImages(
  //       selectedFiles,
  //       uploadFiles
  //     );

  //   console.log(imageIds);
  // };

  //   <input
  //   type="file"
  //   multiple
  //   accept="image/*"
  //   onChange={handleProductImages}
  // />

  // =================================================================


  if (isProfileLoading) {
    return (
      <div className="p-4">
        <UserProfileSkeleton />
      </div>
    )
  }
  if (isProfileError) {
    return <div className="text-red-500 min-h-[90vh] flex items-center justify-center">{t("errorHandling")}</div>;
  }


  return (
    <section className="container mx-auto max-w-5xl p-3">
      <Card className="overflow-hidden border-border p-0 shadow-lg">
        {/* Cover */}
        <div className="h-40 bg-linear-to-r from-primary via-primary/90 to-primary/70" />

        <CardContent className="relative p-6">
          {/* Avatar */}
          <div className="-mt-20 flex flex-col items-center gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="relative">
                <Avatar className="h-40 w-40 border-4 border-primary">
                  <AvatarImage src={
                    customer?.avater?.url
                  } />
                  <AvatarFallback className="text-3xl font-bold">{profile?.username?.charAt(0).toUpperCase() || <GoPerson />}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  disabled={isUploading || isLoadingAddress}
                  className="
                      absolute
                      -bottom-5
                      right-[38%]
                      rounded-full"
                  onClick={() => {
                    if (customer?.documentId) {
                      fileInputRef.current?.click()
                    } else {
                      toast.error(`${isRTL ? "لازم تضيف عنوانك الشخصي عشان ترفع الصورة" : "You should add your personal Address to upload image"}`);
                      return;
                    }
                  }}
                >
                  {isUploading ? (
                    "..."
                  ) : (
                    <Camera />
                  )}
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleImageChange}
                />
              </div>


              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">
                  {profile?.username || "-"}
                </h1>

                <p className="text-muted-foreground text-center md:text-right md:ltr:text-left">
                  {isAdmin ? t("admin") : t("customerAccount")}
                </p>
              </div>
            </div>
            <Link to={changePasswordPath}>
              <Button variant={"secondary"} fullWidth className="text-white text-sm mb-2">
                {t("changePassword")} <FaExchangeAlt />
              </Button>
            </Link>
          </div>

          <Separator className="my-8" />

          <div className={`${isAdmin ? "" : "grid gap-4 md:grid-cols-2"}`}>
            <Card className="relative p-2 md:p-0">
              <CardHeader className="mb-4">
                <CardTitle>
                  {t("personalInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <User size={18} />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("firstName")}
                    </p>
                    <p className="font-medium">
                      {firstN || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User size={18} />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("middleName")}
                    </p>
                    <p className="font-medium">
                      {middleN || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User size={18} />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("lastName")}
                    </p>
                    <p className="font-medium">
                      {lastN || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("email")}
                    </p>
                    <p className="font-medium">
                      {profile?.email || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>

              <DialogDemo open={open} setOpen={setOpen} formId="update-profile-form" children={<Button className={`w-full mx-auto md:w-fit md:absolute top-1 ${isRTL ? "left-1" : "right-1"}`}>
                {t("update")} {t("profile")} <MdBrowserUpdated />
              </Button>} title={`${t("updateProfile")}`} submitButton={isRTL ? "احفظ التغيرات" : "Save changes"} loading={isLoading} body={
                <form onSubmit={handleSubmit(onSubmit)} id="update-profile-form" className="space-y-4" >
                  <Input {...register("username")} placeholder={t("fullName")} />
                  {errors.username && (
                    <p className="text-destructive text-sm">
                      {errors.username.message}
                    </p>
                  )}
                  <Input {...register("email")} placeholder={t("email") + "..."} />
                  {errors.email && (
                    <p className="text-destructive text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </form>
              } />
            </Card>

            {!isAdmin && (<UserAddress />)}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}