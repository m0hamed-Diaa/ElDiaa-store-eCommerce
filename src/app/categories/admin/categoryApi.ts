import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    StrapiCategory,
    StrapiResponse,
    StrapiSingleResponse,
} from "@/interfaces";
import { getAuth } from "@/lib/authCookies";

const API_URL = import.meta.env.VITE_API_URL;

export const adminCategoriesApi = createApi({
    reducerPath: "adminCategoriesApi",

    tagTypes: ["Categories"],

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
           GET CATEGORIES
        ========================= */
        getCategories: builder.query<
            StrapiResponse<StrapiCategory>,
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
                return `/categories?populate=*&locale=${lang}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[title][$containsi]=${search}&sort=createdAt:${sort}`;
            },

            providesTags: ["Categories"],
        }),

        // Get Single Category
        getSingleCategory: builder.query<
            StrapiSingleResponse<StrapiCategory>,
            { lang: string; documentId: string }
        >({
            query: ({ lang, documentId }) =>
                `/categories/${documentId}?locale=${lang}`,
        }),

        /* =========================
           CREATE CATEGORIES
        ========================= */
        createCategory: builder.mutation({
            query: (body) => ({
                url: "/categories",
                method: "POST",
                body: {
                    data: body
                },
            }),

            invalidatesTags: ["Categories"],
        }),

        // CREATE CATEGORY TRANSLATION
        addCategoryTranslation: builder.mutation({
            query: ({
                documentId,
                locale,
                title,
            }) => ({
                url: `/categories/${documentId}?locale=${locale}`,
                method: "PUT",
                body: {
                    data: { title },
                },
            }),
        }),

        /* =========================
           UPDATE CATEGORIES
        ========================= */
        updateCategory: builder.mutation({
            query: ({
                documentId,
                locale,
                body
            }) => ({
                url: `/categories/${documentId}?locale=${locale}`,
                method: "PUT",
                body: {
                    data: body
                },
            }),

            invalidatesTags: ["Categories"],
        }),

        /* =========================
           DELETE CATEGORIES
        ========================= */
        deleteCategory: builder.mutation({
            query: (documentId: string) => ({
                url: `/categories/${documentId}`,
                method: "DELETE",
            }),

            invalidatesTags: ["Categories"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetSingleCategoryQuery,
    useCreateCategoryMutation,
    useAddCategoryTranslationMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = adminCategoriesApi;