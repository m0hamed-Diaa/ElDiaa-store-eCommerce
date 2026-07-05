import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    IHeroSlide,
    StrapiResponse,
    StrapiSingleResponse,
} from "@/interfaces";
import { getAuth } from "@/lib/authCookies";

const API_URL = import.meta.env.VITE_API_URL;

export const adminHeroSlidesApi = createApi({
    reducerPath: "adminHeroSlidesApi",

    tagTypes: ["HeroSlides"],

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api`,

        prepareHeaders: (headers) => {
            const token = getAuth()?.token;

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

        // Get Single Banner
        getSingleHeroSlide: builder.query<
            StrapiSingleResponse<IHeroSlide>,
            { lang: string; documentId: string }
        >({
            query: ({ lang, documentId }) =>
                `/hero-slides/${documentId}?locale=${lang}&populate=*`,
        }),

        /* =========================
           CREATE HERO SLIDES
        ========================= */
        createHeroSlide: builder.mutation({
            query: (body) => ({
                url: "/hero-slides",
                method: "POST",
                body: {
                    data: body,
                },
            }),

            invalidatesTags: ["HeroSlides"],
        }),
        // CREATE HERO SLIDE TRANSLATION
        addHeroSlideTranslation: builder.mutation({
            query: ({
                documentId,
                locale,
                title,
                subtitle,
                image
            }) => ({
                url: `/hero-slides/${documentId}?locale=${locale}`,
                method: "PUT",
                body: {
                    data: { title, subtitle, image },
                },
            }),
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
                body: {
                    data: body
                }
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
    useGetSingleHeroSlideQuery,
    useCreateHeroSlideMutation,
    useAddHeroSlideTranslationMutation,
    useUpdateHeroSlideMutation,
    useDeleteHeroSlideMutation,
} = adminHeroSlidesApi;