import { closeDialogAdmin, selectIsDialogOpen, toggleDialogAdmin } from "@/app/admin/uiDialogSlice";
import { selectLang, toggleLanguage } from "@/app/features/language/languageSlice";
import { useDeleteHeroSlideMutation, useGetHeroSlidesQuery } from "@/app/hero-slides/admin/heroSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import AdminHeroSlidesSkeleton from "@/components/admin/skeletons/AdminHeroSlidesSkeleton";
import StatCard from "@/components/admin/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { DialogDemo } from "@/components/shared/DialogDemo";
import DropdownMenuActions from "@/components/shared/DropdownMenuActions";
import FilteringComponent from "@/components/shared/Filtering";
import PaginationDemo from "@/components/shared/PaginationDemo";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { formatTimeAgo } from "@/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


const AdminHeroSlides = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("adminHeroSlides");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    const [Lang, setLang] = useState<"ar" | "en">(lang);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<
        "asc" | "desc"
    >("desc");
    const [page, setPage] = useState(1);
    const { data, error, isLoading } = useGetHeroSlidesQuery({ lang: Lang, search, sort, page });

    const slides = data?.data ?? [];
    const totalSlides = slides.length;
    const publishedSlides = slides.filter((slide) => slide.publishedAt).length;
    const discountSlides = slides.filter((slide) => slide.linkType === "discount").length;
    const categoriesCount = new Set(
        slides
            .filter((slide) => slide.category)
            .map((slide) => slide.category?.documentId)
    ).size;


    // if admin click to delete Banner
    const [DeleteHeroSlide, { isLoading: isBannerDeleting }] =
        useDeleteHeroSlideMutation();

    const dialogState = useAppSelector(selectIsDialogOpen);
    const dispatch = useAppDispatch();
    const [deleteDocumentId, setDeleteDocumentId] = useState("");
    const deleteCategory = async (documentId: string) => {
        try {
            await DeleteHeroSlide(documentId).unwrap();
            toast.success(
                isRTL
                    ? "تم حذف البانر بنجاح"
                    : "Banner deleted successfully"
            );
            dispatch(toggleLanguage());
            await DeleteHeroSlide(documentId).unwrap();
            setDeleteDocumentId("");
            dispatch(toggleLanguage());
            dispatch(closeDialogAdmin());
        } catch {
            toast.error(isRTL ? "حدث شئ خطأ، حاول مرة اخري لاحقا" : "Something went wrong, try again leter");
        }
    }

    if (error) {
        return <div className="text-red-500">{t("fetchError")}</div>;
    }
    if (isLoading) {
        return <AdminHeroSlidesSkeleton />;
    }
    return (
        <div className="space-y-6 p-3">
            <div className="flex items-center justify-between flex-col sm:flex-row">
                <h1 className="text-3xl font-bold">
                    {t("heroSlides")}
                </h1>
                <Button className="w-full mt-2 sm:w-fit sm:mt-0" onClick={() => navigate("/admin/hero-slides/create")}>
                    {t("addNewSlide")}
                    <Plus />
                </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <StatCard title={t("totalSlides")} value={`${totalSlides}`} />
                <StatCard title={t("published")} value={`${publishedSlides}`} />
                <StatCard title={t("discount")} value={`${discountSlides}`} />
                <StatCard title={t("bannerCategories")} value={`${categoriesCount}`} />
            </div>

            {/* filtering */}
            <FilteringComponent search={search} setSearch={setSearch} sort={sort} setSort={setSort} dataLength={data?.data?.length || 0} translationKey="adminCategories" disabled={isLoading} Lang={Lang} setLang={setLang} />
            {/* Data Table */}
            <DataTable tableHeader={<>
                <TableHead className="text-center">{t("heroSlidesId")}</TableHead>
                <TableHead className="text-center">{t("title")}</TableHead>
                <TableHead className="text-center">{t("subtitle")}</TableHead>
                <TableHead className="text-center">{t("image")}</TableHead>
                <TableHead className="text-center">{t("createdAt")}</TableHead>
                <TableHead className="text-center">{t("linkType")}</TableHead>
                <TableHead className="text-center">{t("customUrl")}</TableHead>
                <TableHead className="text-center">{t("category")}</TableHead>
                <TableHead className="text-center">{t("action")}</TableHead>
            </>} tableBody={data?.data?.length ? data?.data?.map((banner) => (
                <TableRow key={banner.id}>
                    <TableCell className="text-center">{banner.id}</TableCell>
                    <TableCell className="text-center">{banner.title}</TableCell>
                    <TableCell className="text-center">{banner.subtitle || "-"}</TableCell>
                    <TableCell className="text-center">
                        <img
                            src={banner?.image?.url}
                            alt={banner.title}
                            className="h-16 w-16 object-cover rounded-xl border border-primary"
                        />
                    </TableCell>
                    <TableCell className="text-center">{formatTimeAgo(banner.createdAt, lang)}</TableCell>
                    <TableCell className="text-center">{t(banner.linkType)}</TableCell>
                    <TableCell className="text-center" title={banner?.customUrl || ""}>{banner?.customUrl ? banner?.customUrl?.slice(0, 30) + "..." : "-"}</TableCell>
                    <TableCell className="text-center">{banner.category?.title || "-"}</TableCell>
                    <TableCell className="text-center" onClick={() => setDeleteDocumentId(banner.documentId)}>
                        <DropdownMenuActions productLang={banner.locale} documentId={banner.documentId} updatePath="/admin/hero-slides/update/" />
                    </TableCell>
                </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-destructive font-bold">
                        {t("noResults")}
                    </TableCell>
                </TableRow>
            )} translationKey={"adminHeroSlides"} />

            {/* Open Dialog for deleting */}
            <DialogDemo open={dialogState} onClick={() => deleteCategory(deleteDocumentId)} setOpen={() => dispatch(toggleDialogAdmin())} title={isRTL ? "حذف هذا البانر!" : "Delete this banner!"} description={isRTL ? `هل تريد حذف البانر الحالى بالاصدار العربى والانجليزى؟` : `Do you want to delete this current banner with arabic & english version?`} submitButton={isRTL ? "حذف البانر؟" : "Delete Banner?"} loading={isBannerDeleting} />

            {/* Pagination */}
            <PaginationDemo currentPage={page}
                totalPages={data?.meta?.pagination?.pageCount || 1}
                onPageChange={setPage} />
        </div>
    )
}

export default AdminHeroSlides
