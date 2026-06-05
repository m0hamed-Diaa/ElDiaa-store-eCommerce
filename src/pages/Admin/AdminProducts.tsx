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


export default function AdminProductsPage() {
  const { t } = useTranslation("adminProducts");
  const lang = useAppSelector(selectLang);
  const isRTL = lang === "ar";
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<
    "asc" | "desc"
  >("desc");
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useGetProductsQuery({ lang, page, sort, search });

  if (error) {
    return <div className="text-red-500">{t("fetchError")}</div>;
  }

  if (isLoading) {
    return <div className="text-primary">{t("loading")}</div>;
  }
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t("products")}
          </h1>

          <p className="text-muted-foreground">
            {t("productsContent")}
          </p>
        </div>

        <Button className="rounded-xl" disabled={!data?.data.length}>
          {t("addProduct")}
          <Plus className="mr-2 h-4 w-4" />
        </Button>
      </div>

      {/* filtering */}
      <FilteringComponent search={search} setSearch={setSearch} sort={sort} setSort={setSort} dataLength={data?.data?.length || 0} translationKey="adminProducts" />
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
          <TableHead className="text-right">{t("action")}</TableHead>
        </>} tableBody={data?.data?.length ? data?.data?.map((product) => (
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
            <TableCell>{product.discount ? <Badge className="bg-red-500">
              {product.discount}% {t("off")}
            </Badge> : ("-")}</TableCell>
            <TableCell>{product.rating}</TableCell>
            <TableCell className="text-right">
              <DropdownMenuActions id={product.id} />
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={10} className="h-24 text-center text-destructive font-bold">
              {t("noResults")} {search && `"${search}"`}
            </TableCell>
          </TableRow>
        )} />
      {/* Pagination */}
      <PaginationDemo currentPage={page}
        totalPages={data?.meta?.pagination?.pageCount || 1}
        onPageChange={setPage} />
    </div>
  );
}