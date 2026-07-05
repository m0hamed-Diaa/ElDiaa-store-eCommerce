import { closeDialogAdmin, selectIsDialogOpen, toggleDialogAdmin } from "@/app/admin/uiDialogSlice";
import { useDeleteCategoryMutation, useGetCategoriesQuery } from "@/app/categories/admin/categoryApi";
import { selectLang, toggleLanguage } from "@/app/features/language/languageSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import AdminCategoriesSkeleton from "@/components/admin/skeletons/AdminCategoriesSkeleton";
import StatCard from "@/components/admin/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { DialogDemo } from "@/components/shared/DialogDemo";
import DropdownMenuActions from "@/components/shared/DropdownMenuActions";
import FilteringComponent from "@/components/shared/Filtering";
import PaginationDemo from "@/components/shared/PaginationDemo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CategoriesPage() {
    const navigate = useNavigate();
    const { t } = useTranslation("adminCategories");
    const lang = useAppSelector(selectLang);
    const isRTL = lang === "ar";
    const [Lang, setLang] = useState<"ar" | "en">(lang);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<
        "asc" | "desc"
    >("desc");
    const [page, setPage] = useState(1);
    const { data, error, isLoading } = useGetCategoriesQuery({ lang: Lang, search, sort, page });

    // if admin click to delete Category
    const [DeleteCategory, { isLoading: isCategoryDeleting }] =
        useDeleteCategoryMutation();

    const dialogState = useAppSelector(selectIsDialogOpen);
    const dispatch = useAppDispatch();
    const [deleteDocumentId, setDeleteDocumentId] = useState("");
    const deleteCategory = async (documentId: string) => {
        try {
            await DeleteCategory(documentId).unwrap();
            toast.success(
                isRTL
                    ? "تم حذف الفئة بنجاح"
                    : "Category deleted successfully"
            );
            dispatch(toggleLanguage());
            await DeleteCategory(documentId).unwrap();
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
        return <AdminCategoriesSkeleton />;
    }

    return (
        <div className="space-y-6 p-3">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    {t("categories")}
                </h1>

                <Button onClick={() => navigate("/admin/categories/create")}>
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
            <FilteringComponent search={search} setSearch={setSearch} sort={sort} setSort={setSort} dataLength={data?.data?.length || 0} translationKey="adminCategories" disabled={isLoading} Lang={Lang} setLang={setLang} />
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
                    <TableCell className="text-center" onClick={() => setDeleteDocumentId(cat.documentId)}>
                        <DropdownMenuActions productLang={cat.locale} documentId={cat.documentId} updatePath="/admin/categories/update/" />
                    </TableCell>
                </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-destructive font-bold">
                        {t("noResults")}
                    </TableCell>
                </TableRow>
            )} translationKey={"adminCategories"} />

            {/* Open Dialog for deleting */}
            <DialogDemo open={dialogState} onClick={() => deleteCategory(deleteDocumentId)} setOpen={() => dispatch(toggleDialogAdmin())} title={isRTL ? "حذف هذا المنتج!" : "Delete this product!"} description={isRTL ? `هل تريد حذف المنتج الحالى بالاصدار العربى والانجليزى؟` : `Do you want to delete this current product with arabic & english version?`} submitButton={isRTL ? "حذف المنتج؟" : "Delete Product?"} loading={isCategoryDeleting} />

            {/* Pagination */}
            <PaginationDemo currentPage={page}
                totalPages={data?.meta?.pagination?.pageCount || 1}
                onPageChange={setPage} />
        </div >
    );
}