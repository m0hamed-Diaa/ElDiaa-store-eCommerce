import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    IHeroSlide,
    StrapiResponse,
} from "@/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

export const adminHeroSlidesApi = createApi({
    reducerPath: "adminHeroSlidesApi",

    tagTypes: ["HeroSlides"],

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api`,

        prepareHeaders: (headers) => {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc5OTc5NjUwLCJleHAiOjE3ODI1NzE2NTB9.7WCrqwRC2QwkAPfWViEGM9NuKGtDLczvE0bD30El0ME";

            if (token) {
                headers.set(
                    "Authorization",
                    `Bearer ${token}`
                );
            }

            return headers;
        },
    }),

    endpoints: (builder) => ({
        /* =========================
           GET HERO SLIDES
        ========================= */
        getHeroSlides: builder.query<
            StrapiResponse<IHeroSlide>,
            {
                lang: string;
                page?: number;
                pageSize?: number;
                search?: string;
                sort?: "asc" | "desc";
            }
        >({
            query: ({
                lang,
                page = 1,
                pageSize = 8,
                search = "",
                sort = "desc",
            }) => {
                return `/hero-slides?populate=*&locale=${lang}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[title][$containsi]=${search}&sort=createdAt:${sort}`;
            },

            providesTags: ["HeroSlides"],
        }),

        /* =========================
           CREATE HERO SLIDES
        ========================= */
        createHeroSlide: builder.mutation({
            query: (body) => ({
                url: "/hero-slides",
                method: "POST",
                body,
            }),

            invalidatesTags: ["HeroSlides"],
        }),

        /* =========================
           UPDATE HERO SLIDES
        ========================= */
        updateHeroSlide: builder.mutation({
            query: ({
                documentId,
                body,
            }: {
                documentId: string;
                body: unknown;
            }) => ({
                url: `/hero-slides/${documentId}`,
                method: "PUT",
                body,
            }),

            invalidatesTags: ["HeroSlides"],
        }),

        /* =========================
           DELETE HERO SLIDES
        ========================= */
        deleteHeroSlide: builder.mutation({
            query: (documentId: string) => ({
                url: `/hero-slides/${documentId}`,
                method: "DELETE",
            }),

            invalidatesTags: ["HeroSlides"],
        }),
    }),
});

export const {
    useGetHeroSlidesQuery,
    useCreateHeroSlideMutation,
    useUpdateHeroSlideMutation,
    useDeleteHeroSlideMutation,
} = adminHeroSlidesApi;