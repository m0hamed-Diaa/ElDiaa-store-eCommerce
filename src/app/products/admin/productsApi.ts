import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    IProduct,
    StrapiResponse,
} from "@/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

export const adminProductsApi = createApi({
    reducerPath: "adminProductsApi",

    tagTypes: ["Products"],

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api`,

        // const auth = getAuth();

        prepareHeaders: (headers) => {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc5OTc5NjUwLCJleHAiOjE3ODI1NzE2NTB9.7WCrqwRC2QwkAPfWViEGM9NuKGtDLczvE0bD30El0ME";
            // if (auth?.token) {

            //     headers.set(
            //         "Authorization",
            //         `Bearer ${token}`
            //     );
            // }
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
           GET PRODUCTS
        ========================= */
        getProducts: builder.query<
            StrapiResponse<IProduct>,
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
                return `/products?populate=*&locale=${lang}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[title][$containsi]=${search}&sort=createdAt:${sort}`;
            },

            providesTags: ["Products"],
        }),

        /* =========================
           CREATE PRODUCT
        ========================= */
        createProduct: builder.mutation({
            query: (body) => ({
                url: "/products",
                method: "POST",
                body,
            }),

            invalidatesTags: ["Products"],
        }),

        /* =========================
           UPDATE PRODUCT
        ========================= */
        updateProduct: builder.mutation({
            query: ({
                documentId,
                body,
            }: {
                documentId: string;
                body: unknown;
            }) => ({
                url: `/products/${documentId}`,
                method: "PUT",
                body,
            }),

            invalidatesTags: ["Products"],
        }),

        /* =========================
           DELETE PRODUCT
        ========================= */
        deleteProduct: builder.mutation({
            query: (documentId: string) => ({
                url: `/products/${documentId}`,
                method: "DELETE",
            }),

            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = adminProductsApi;