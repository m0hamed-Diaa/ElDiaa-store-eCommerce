import { useState } from "react";
import {
  Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useDeleteProductMutation, useGetProductsQuery } from "@/app/products/admin/productsApi";
import { selectLang, toggleLanguage } from "@/app/features/language/languageSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import PaginationDemo from "@/components/shared/PaginationDemo";
import DropdownMenuActions from "@/components/shared/DropdownMenuActions";
import { formatTimeAgo } from "@/utils";
import FilteringComponent from "@/components/shared/Filtering";
import { useNavigate } from "react-router-dom";
import AdminProductsSkeleton from "@/components/admin/skeletons/AdminProductsSkeleton";
import { usePageTitle } from "@/components/usePageTitle";
import { DialogDemo } from "@/components/shared/DialogDemo";
import { closeDialogAdmin, selectIsDialogOpen, toggleDialogAdmin } from "@/app/admin/uiDialogSlice";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation("adminProducts");
  const lang = useAppSelector(selectLang);
  const isRTL = lang === "ar";
  const [search, setSearch] = useState("");
  const [Lang, setLang] = useState<"ar" | "en">(lang);
  const [sort, setSort] = useState<
    "asc" | "desc"
  >("desc");
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useGetProductsQuery({ lang: Lang, page, sort, search });
  usePageTitle("منتجات الادمن | متجر الضياء", "Admin Products | El-diaa Store")
  // if admin click to delete product
  const [DeleteProduct, { isLoading: isProductDeleting }] =
    useDeleteProductMutation();

  const dialogState = useAppSelector(selectIsDialogOpen);
  const dispatch = useAppDispatch();
  const [deleteDocumentId, setDeleteDocumentId] = useState("");
  const deleteProduct = async (documentId: string) => {
    try {
      await DeleteProduct(documentId).unwrap();
      toast.success(
        isRTL
          ? "تم حذف المنتج بنجاح"
          : "Product deleted successfully"
      );
      dispatch(toggleLanguage());
      await DeleteProduct(documentId).unwrap();
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
    return <AdminProductsSkeleton />;
  }

  return (
    <div className="space-y-6 p-3">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t("products")}
          </h1>

          <p className="text-muted-foreground">
            {t("productsContent")}
          </p>
        </div>

        {/* Adding product */}
        <Button onClick={() => navigate("/admin/products/create")}>
          {t("addProduct")}
          <Plus className="mr-2 h-4 w-4" />
        </Button>
      </div>

      {/* filtering */}
      <FilteringComponent showLang={true} disabled={isLoading} Lang={Lang} setLang={setLang} search={search} setSearch={setSearch} sort={sort} setSort={setSort} dataLength={data?.data?.length || 0} translationKey="adminProducts" />
      {/* Products Table */}
      <DataTable translationKey="adminProducts"
        tableHeader={<>
          <TableHead className="text-center">{t("productId")}</TableHead>
          <TableHead className="text-center">{t("title")}</TableHead>
          <TableHead className="text-center">{t("image")}</TableHead>
          <TableHead className="text-center">{t("description")}</TableHead>
          <TableHead className="text-center">{t("price")}</TableHead>
          <TableHead className="text-center">{t("createdAt")}</TableHead>
          <TableHead className="text-center">{t("category")}</TableHead>
          <TableHead className="text-center">{t("stock")}</TableHead>
          <TableHead className="text-center">{t("discount")}</TableHead>
          <TableHead className="text-center">{t("rating")}</TableHead>
          <TableHead className="text-center">{t("tran")}</TableHead>
          <TableHead className="text-right">{t("action")}</TableHead>
        </>} tableBody={data?.data?.length ? data?.data?.map((product) => {
          const requiredLocales = ["en", "ar"];

          const existingLocales = [
            product.locale,
            ...(product.localizations?.map(
              item => item.locale
            ) || [])
          ];

          const missingLocales =
            requiredLocales.filter(
              locale =>
                !existingLocales.includes(locale)
            );
          const LocaleLang = missingLocales.join(", ") === "ar";
          const isArabicLang = LocaleLang ? isRTL ? "عربى" : "Arabic" : isRTL ? "انجليزى" : "English";
          return (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>
                <img
                  src={product.thumbnail?.formats?.thumbnail?.url}
                  alt={product.title}
                  className="h-16 w-16 object-cover rounded-xl border border-primary"
                />
              </TableCell>
              <TableCell title={product.description}>
                {product.description.slice(0, 40)}...
              </TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{formatTimeAgo(product.createdAt, lang)}</TableCell>
              <TableCell>{product.categories.map((cat) => (<Badge variant="secondary" className={`${isRTL ? "ml-2" : "mr-2"}`} key={cat.id}>{cat.title}</Badge>))}</TableCell>
              <TableCell>{<Badge
                variant={
                  product.stock < 10
                    ? "destructive"
                    : "default"
                }
              >
                {product.stock}
              </Badge>}</TableCell>
              <TableCell>{product.discount ? <Badge variant={"destructive"}>
                {product.discount}% {t("off")}
              </Badge> : ("-")}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className="text-center">
                {
                  missingLocales.length > 0 ? (
                    <div className="flex flex-col">
                      <Badge variant="destructive" className="p-4">
                        {isRTL
                          ? <>{`الترجمة الناقصة: ${isArabicLang}`}: <Button variant={"link"} className="p-0" onClick={() => navigate(`/admin/products/create`)}>اضافة</Button></>
                          : <>{`Missing translation: ${isArabicLang}`}: <Button variant={"link"} className="p-0" onClick={() => navigate(`/admin/products/create`)}>Create</Button></>
                        }
                      </Badge>
                    </div>
                  )
                    : <Badge variant={"default"}>
                      ✅ </Badge>}
              </TableCell>
              <TableCell className="text-right" onClick={() => setDeleteDocumentId(product.documentId)}>
                <DropdownMenuActions updatePath={`/admin/products/update/`} documentId={product.documentId} productLang={product.locale} />
              </TableCell>
            </TableRow>
          )
        }) : (
          <TableRow>
            <TableCell colSpan={10} className="h-24 text-center text-destructive font-bold">
              {t("noResults")} {search && `"${search}"`}
            </TableCell>
          </TableRow>
        )
        } />

      {/* Open Dialog for deleting */}
      <DialogDemo open={dialogState} onClick={() => deleteProduct(deleteDocumentId)} setOpen={() => dispatch(toggleDialogAdmin())} title={isRTL ? "حذف هذا المنتج!" : "Delete this product!"} description={isRTL ? `هل تريد حذف المنتج الحالى بالاصدار العربى والانجليزى؟` : `Do you want to delete this current product with arabic & english version?`} submitButton={isRTL ? "حذف المنتج؟" : "Delete Product?"} loading={isProductDeleting} />

      {/* Pagination */}
      < PaginationDemo currentPage={page}
        totalPages={data?.meta?.pagination?.pageCount || 1}
        onPageChange={setPage} />
    </div>
  );
}