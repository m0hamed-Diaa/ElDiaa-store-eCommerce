import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { selectInternetStatus } from "@/app/features/Internet/internetSlice";
import { selectLang } from "@/app/features/language/languageSlice";
import { useAppSelector } from "@/app/hooks";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/skeletens/ProductCardSkeleton";
import type { IHeroSlide, IProduct, StrapiCategory } from "@/interfaces";
import { Link } from "react-router-dom";
import { useGetHeroSlidesQuery } from "@/app/hero-slides/user/heroSlice";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { formatTimeAgo } from "@/utils";
import { useGetProductsQuery } from "@/app/products/user/productsApi";
import { useGetCategoriesQuery } from "@/app/categories/user/categoryApi";

export default function HomePage() {
  const lang = useAppSelector(selectLang);
  const isRTL = lang === "ar";
  const { t } = useTranslation("home");
  const [search, setSearch] = useState<string>("");

  // Intenet Status
  const isOnline = useAppSelector(selectInternetStatus);
  console.log(isOnline);

  // Hero slide
  const { data: dataHero, error: heroError, isLoading: isLoadingHero } = useGetHeroSlidesQuery({ lang, sort: "desc", pageSize: 5 });
  // Products api
  const { data, error, isLoading } = useGetProductsQuery({ lang, search, pageSize: 8 });
  // Category products
  const { data: categoriesData } = useGetCategoriesQuery({ lang });
  // filter hero-slide
  const getHeroLink = (slide: IHeroSlide) => {
    const base = "/products";
    switch (slide.linkType) {
      case "category":
        return `${base}?category=${slide.category?.documentId}`;

      case "discount":
        return `${base}?discount=true`;

      case "custom":
        return slide?.customUrl || base;

      default:
        return base;
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center gap-5 my-10 px-7 md:px-10">
          <div className="relative h-90 w-full md:flex-1 overflow-hidden rounded-xl bg-muted/40">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="relative h-90 hidden md:flex md:flex-1 overflow-hidden rounded-xl bg-muted/40">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-7 md:px-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />))}
        </div>
      </>
    );
  }
  if (isLoadingHero) {
    return (
      <>
        <div className="flex items-center gap-5 my-10 px-7 md:px-10">
          <div className="relative h-90 w-full md:flex-1 overflow-hidden rounded-xl bg-muted/40">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="relative h-90 hidden md:flex md:flex-1 overflow-hidden rounded-xl bg-muted/40">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
      </>
    );
  }
  if (error) {
    return <div className="text-red-500 min-h-[90vh] flex items-center justify-center">{t("errorHandling")} {search}</div>;
  }
  if (heroError) {
    return <div className="text-red-500 min-h-[90vh] flex items-center justify-center">{t("errorHandling")}</div>;
  }


  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className={`flex justify-center mt-2 md:mx-6 md:justify-start`}>
        <Input
          placeholder={t("inputSearch")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-[95%]
            md:w-[50%]
            focus:h-12
            rounded-xl
            shadow-md
            hover:shadow-lg
            transition-all
          "
        />
      </div>

      {/* Hero Swiper */}
      <div className={`relative group cursor-pointer p-4 md:p-6 ${isRTL ? "rtl" : "ltr"}`}>
        {/* Prev Button */}
        <div
          className={`
            swiper-button-prev-custom
            absolute top-1/2 z-10 -translate-y-1/2
            rounded-full border border-border/50
            bg-background/80 p-2 backdrop-blur-md
            transition-all duration-300
            opacity-0
            group-hover:opacity-100 flex
            hover:bg-primary hover:text-white
            ${isRTL ? "right-4" : "left-4"}
            `}
        >
          {isRTL ? (
            <MdOutlineKeyboardArrowRight size={28} />
          ) : (
            <MdOutlineKeyboardArrowLeft size={28} />
          )}
        </div>
        {/* Next Button */}
        <div
          className={`
          swiper-button-next-custom
          absolute top-1/2 z-10 -translate-y-1/2
          rounded-full border border-border/50
          bg-background/80 p-2 backdrop-blur-md
          transition-all duration-300
          opacity-0
          group-hover:opacity-100 flex
          hover:bg-primary hover:text-white
          ${isRTL ? "left-4" : "right-4"}
        `}
        >
          {isRTL ? (
            <MdOutlineKeyboardArrowLeft size={28} />
          ) : (
            <MdOutlineKeyboardArrowRight size={28} />
          )}
        </div>
        <Swiper
          key={isRTL ? "ltr" : "rtl"}
          dir={isRTL ? "ltr" : "rtl"}
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={20}
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            991: {
              slidesPerView: 2,
            },
            1280: {
              slidesPerView: 3,
            },
          }}
        >
          {dataHero?.data?.map((p: IHeroSlide) => (
            <SwiperSlide key={p.id}>
              <Link to={`${getHeroLink(p)}`}
                className={`
                h-80 rounded-3xl bg-primary p-6
                flex flex-col-reverse items-center justify-around  gap-6
                md:flex-row
                md:h-72
                relative
                overflow-hidden
                transition-transform duration-300 hover:scale-[1.01]
                ${isRTL ? "text-center md:text-right" : "text-center md:text-left"}
                `}
              >
                {/* Image */}
                <img
                  src={p?.image?.url}
                  alt={p.title}
                  className="
                h-40 object-cover drop-shadow-2xl
                transition-transform duration-300 group-hover:scale-[1.05]
                lg:h-48
              "
                />
                {/* Content */}
                <div>
                  <h2 className="text-lg md:text-xl font-bold leading-tight">
                    {p.title}
                  </h2>

                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {p.subtitle}
                  </p>
                </div>
                <span className={`absolute top-2 ${isRTL ? "right-2" : "left-2"}`}>{formatTimeAgo(p.createdAt, `${lang}`)}</span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Products */}
      <section className="px-4 py-10 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              {t("featuresProducts")}
            </h2>

            <p className="mt-2 text-muted-foreground">
              {t("featuresProductsContent")}
            </p>
          </div>

        </div>
        {/* latest Products */}
        {data?.data?.length ?
          <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.data?.map((p: IProduct) => (
              <ProductCard p={p} key={p.id} showActions={false} />
            ))}
          </div>
          :
          <h2 className="text-red-500 flex justify-center items-center h-100">{t("noDataFound")} "{search}"</h2>
        }

        {/* Categories + products */}
        {categoriesData?.data?.length ? categoriesData?.data?.map((cat: StrapiCategory) => {
          return (
            <React.Fragment key={cat.documentId}>
              <div className="my-8">
                <h2 className="text-3xl font-bold">
                  {cat.title}
                </h2>
              </div >
              {cat?.products?.length ?
                <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {cat?.products?.slice(0, 8).map((p) => {
                    return (
                      <ProductCard key={p.documentId} p={p} showActions={false} />
                    )
                  }
                  )}
                </div>
                : <div className="text-center mt-8 text-destructive">{t("noDataFound")}</div>}
            </React.Fragment>
          )
        }) : <div className="text-center mt-8 text-destructive">{t("noDataFound")} {t("forCategories")}</div>}

        <Link to="/products">
          <Button variant="outline" className="mt-5">
            {t("viewAll")}
          </Button>
        </Link>
      </section>
    </div>
  )

}
