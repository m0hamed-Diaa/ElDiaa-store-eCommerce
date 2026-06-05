import { useGetCategoriesQuery } from "@/app/categories/admin/categoryApi";
import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";
import StatCard from "@/components/admin/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import DropdownMenuActions from "@/components/shared/DropdownMenuActions";
import FilteringComponent from "@/components/shared/Filtering";
import PaginationDemo from "@/components/shared/PaginationDemo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CategoriesPage() {
    const { t } = useTranslation("adminCategories");
    const lang = useAppSelector(selectLang);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<
        "asc" | "desc"
    >("desc");
    const [page, setPage] = useState(1);
    const { data, error, isLoading } = useGetCategoriesQuery({ lang, search, sort, page });
    if (error) {
        return <div className="text-red-500">{t("fetchError")}</div>;
    }
    if (isLoading) {
        return <div className="text-primary">{t("loading")}</div>;
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    {t("categories")}
                </h1>

                <Button>
                    {t("addCategory")}
                    <Plus />
                </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <StatCard title={`${t("total")}`} value={`${data?.data?.length || 0}`} />
                <StatCard title={t("active")} value={`${data?.data?.filter((cat) => cat.products.length > 0).length || 0}`} />
                <StatCard title={t("products")} value={`${data?.data?.reduce((acc, cat) => acc + cat.products.length, 0) || 0}`} />
                <StatCard title={t("empty")} value={`${data?.data?.filter((cat) => cat.products.length === 0).length || 0}`} />
            </div>

            {/* filtering */}
            <FilteringComponent search={search} setSearch={setSearch} sort={sort} setSort={setSort} dataLength={data?.data?.length || 0} translationKey="adminCategories" />
            {/* Data Table */}
            <DataTable tableHeader={<>
                <TableHead className="text-center">{t("categoryId")}</TableHead>
                <TableHead className="text-center">{t("name")}</TableHead>
                <TableHead className="text-center">{t("products")}</TableHead>
                <TableHead className="text-center">{t("status")}</TableHead>
                <TableHead className="text-center">{t("action")}</TableHead>
            </>} tableBody={data?.data?.length ? data?.data?.map((cat) => (
                <TableRow key={cat.id}>
                    <TableCell className="text-center">{cat.id}</TableCell>
                    <TableCell className="text-center">{cat.title}</TableCell>
                    <TableCell className="text-center">{cat.products.length}</TableCell>
                    <TableCell className="text-center">{cat.products.length > 0 ? <Badge variant="default">{t("active")}</Badge> : <Badge variant="destructive">{t("inactive")}</Badge>}</TableCell>
                    <TableCell className="text-center">
                        <DropdownMenuActions id={cat.id} />
                    </TableCell>
                </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-destructive font-bold">
                        {t("noResults")}
                    </TableCell>
                </TableRow>
            )} translationKey={"adminCategories"} />

            {/* Pagination */}
            <PaginationDemo currentPage={page}
                totalPages={data?.meta?.pagination?.pageCount || 1}
                onPageChange={setPage} />
        </div >
    );
}