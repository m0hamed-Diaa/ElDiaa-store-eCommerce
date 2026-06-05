import type { IHeroSlide, StrapiResponse } from "@/interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;


export const heroSlideApi = createApi({
    reducerPath: "heroSlideApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api`,
    }),

    endpoints: (builder) => ({
        getHeroSlides: builder.query<StrapiResponse<IHeroSlide>, { lang: string; page?: number; pageSize?: number, sort?: "asc" | "desc" }>({
            query: ({ lang, page = 1, pageSize = 25, sort }) => {
                const sortQuery = sort ? `&sort=createdAt:${sort}` : "";

                return `/hero-slides?populate=*&locale=${lang}&pagination[page]=${page}&pagination[pageSize]=${pageSize}${sortQuery}`;
            }
        }),
    }),
});

export const { useGetHeroSlidesQuery } = heroSlideApi;
