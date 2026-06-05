import { selectLang } from "@/app/features/language/languageSlice";
import { useGetHeroSlidesQuery } from "@/app/hero-slides/admin/heroSlice";
import { useAppSelector } from "@/app/hooks";
import StatCard from "@/components/admin/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import DropdownMenuActions from "@/components/shared/DropdownMenuActions";
import FilteringComponent from "@/components/shared/Filtering";
import PaginationDemo from "@/components/shared/PaginationDemo";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { formatTimeAgo } from "@/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";


const AdminHeroSlides = () => {
    const { t } = useTranslation("adminHeroSlides");
    const lang = useAppSelector(selectLang);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<
        "asc" | "desc"
    >("desc");
    const [page, setPage] = useState(1);
    const { data, error, isLoading } = useGetHeroSlidesQuery({ lang, search, sort, page });

    const slides = data?.data ?? [];
    const totalSlides = slides.length;
    const publishedSlides = slides.filter((slide) => slide.publishedAt).length;
    const discountSlides = slides.filter((slide) => slide.linkType === "discount").length;
    const categoriesCount = new Set(
        slides
            .filter((slide) => slide.category)
            .map((slide) => slide.category?.documentId)
    ).size;

    if (error) {
        return <div className="text-red-500">{t("fetchError")}</div>;
    }
    if (isLoading) {
        return <div className="text-primary">{t("loading")}</div>;
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-col sm:flex-row">
                <h1 className="text-3xl font-bold">
                    {t("heroSlides")}
                </h1>
                <Button className="w-full mt-2 sm:w-fit sm:mt-0">
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
            <FilteringComponent search={search} setSearch={setSearch} sort={sort} setSort={setSort} dataLength={data?.data?.length || 0} translationKey="adminHeroSlides" />
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
                            src={banner.image.url}
                            alt={banner.title}
                            className="h-16 w-16 object-cover rounded-xl border border-primary"
                        />
                    </TableCell>
                    <TableCell className="text-center">{formatTimeAgo(banner.createdAt, lang)}</TableCell>
                    <TableCell className="text-center">{t(banner.linkType)}</TableCell>
                    <TableCell className="text-center" title={banner?.customUrl || ""}>{banner?.customUrl ? banner?.customUrl?.slice(0, 30) + "..." : "-"}</TableCell>
                    <TableCell className="text-center">{banner.category?.title || "-"}</TableCell>
                    <TableCell className="text-center">
                        <DropdownMenuActions id={banner.id} />
                    </TableCell>
                </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-destructive font-bold">
                        {t("noResults")}
                    </TableCell>
                </TableRow>
            )} translationKey={"adminHeroSlides"} />

            {/* Pagination */}
            <PaginationDemo currentPage={page}
                totalPages={data?.meta?.pagination?.pageCount || 1}
                onPageChange={setPage} />
        </div>
    )
}

export default AdminHeroSlides
