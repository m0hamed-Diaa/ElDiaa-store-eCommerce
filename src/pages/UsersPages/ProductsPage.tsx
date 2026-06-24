import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import type { RootState } from "@/app/store";
import ProductCard from "@/components/ProductCard";
import type { IProduct } from "@/interfaces";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { useSearchParams } from "react-router-dom";
import PaginationDemo from "@/components/shared/PaginationDemo";
import { useGetProductsQuery } from "@/app/products/user/productsApi";
import SelectComponent from "@/components/shared/SelectSorting";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTitle } from "@/components/usePageTitle";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const discount = searchParams.get("discount");

  const { t } = useTranslation("products");
  const lang = useAppSelector((state: RootState) => state.language.lang);
  const isRTL = lang === "ar";
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  usePageTitle("المنتجات | متجر الضياء للإلكترونيات", "Products | El-diaa Store For Electronics")

  // const pageSize = 6;
  const { data, error, isLoading } = useGetProductsQuery({ lang, search, category, discount: discount === "true", sort, page: page });

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col gap-4 my-4 px-10 md:flex-row md:items-center md:justify-between relative">
          <Skeleton className="h-10 w-40" />

          <Skeleton className="h-10 md:w-80 w-full" />

          <div className={`absolute top-0 ${isRTL ? "left-10" : "right-10"} md:relative`}>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />))}
        </div>
      </>
    );
  }
  if (error) {
    return <div className="text-red-500 min-h-[90vh] flex items-center justify-center">{t("errorHandling")}</div>;
  }


  return (
    <div className={`container mx-auto px-4 py-10 min-h-screen ${isRTL ? "text-right" : "text-left"}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative">
        <h1 className="text-3xl font-black">{t("badge")}</h1>

        <Input
          placeholder={t("inputSearch")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-80 focus:h-12"
        />
        <div className={`absolute top-0 ${isRTL ? "left-0" : "right-0"} md:relative`}>
          <SelectComponent sort={sort} onChangeSort={setSort} />
        </div>
      </div>

      {/* Show Products */}
      {data?.data?.length ?
        <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.data?.map((p: IProduct) => (
            <ProductCard p={p} key={p.id} showActions />
          ))}
        </div>
        :
        <h2 className="text-red-500 flex justify-center items-center h-100">{t("noDataFound")} "<span className="underline">{search}</span>"</h2>
      }
      {/* Pagination */}
      <PaginationDemo currentPage={page}
        totalPages={data?.meta?.pagination?.pageCount || 1}
        onPageChange={setPage} />
    </div>
  );
};

export default ProductsPage;
