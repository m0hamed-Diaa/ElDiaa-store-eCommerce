import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    StrapiCategory,
    StrapiResponse,
} from "@/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

export const adminCategoriesApi = createApi({
    reducerPath: "adminCategoriesApi",

    tagTypes: ["Categories"],

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

        /* =========================
           CREATE CATEGORIES
        ========================= */
        createCategory: builder.mutation({
            query: (body) => ({
                url: "/categories",
                method: "POST",
                body,
            }),

            invalidatesTags: ["Categories"],
        }),

        /* =========================
           UPDATE CATEGORIES
        ========================= */
        updateCategory: builder.mutation({
            query: ({
                documentId,
                body,
            }: {
                documentId: string;
                body: unknown;
            }) => ({
                url: `/categories/${documentId}`,
                method: "PUT",
                body,
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
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = adminCategoriesApi;