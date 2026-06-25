import { useState } from "react";
import {
  Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useGetProductsQuery } from "@/app/products/admin/productsApi";
import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";
import PaginationDemo from "@/components/shared/PaginationDemo";
import DropdownMenuActions from "@/components/shared/DropdownMenuActions";
import { formatTimeAgo } from "@/utils";
import FilteringComponent from "@/components/shared/Filtering";
import { useNavigate } from "react-router-dom";
import AdminProductsSkeleton from "@/components/admin/skeletons/AdminProductsSkeleton";

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation("adminProducts");
  const lang = useAppSelector(selectLang);
  const isRTL = lang === "ar";
  const [search, setSearch] = useState("");
  const [Lang, setLang] = useState<"ar" | "en">("ar");
  const [sort, setSort] = useState<
    "asc" | "desc"
  >("desc");
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useGetProductsQuery({ lang: Lang, page, sort, search });

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
          const isArabicLang = LocaleLang ? isRTL ? "عربى" : "Arabic" : "";
          return (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>
                <img
                  src={product.thumbnail.formats?.thumbnail?.url}
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
              <TableCell>
                {
                  missingLocales.length > 0 ? (
                    <div className="flex flex-col">
                      <Badge variant="destructive">
                        {isRTL
                          ? <>{`الترجمة الناقصة: ${isArabicLang}`} <Button variant={"link"} className="p-0" onClick={() => navigate(`/admin/products/create`)}>اضافة</Button></>
                          : <>{`Missing translation: ${isArabicLang}`} + <Button variant={"link"} className="p-0" onClick={() => navigate(`/admin/products/create`)}>Create</Button></>
                        }
                      </Badge>
                    </div>
                  )
                    : <Badge variant={"default"}>
                      ✅ </Badge>}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenuActions documentId={product.documentId} productLang={product.locale} />
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

      {/* Pagination */}
      < PaginationDemo currentPage={page}
        totalPages={data?.meta?.pagination?.pageCount || 1}
        onPageChange={setPage} />
    </div>
  );
}