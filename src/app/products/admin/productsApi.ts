import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    IProduct,
    StrapiResponse,
    StrapiSingleResponse,
} from "@/interfaces";
import { getAuth } from "@/lib/authCookies";

const API_URL = import.meta.env.VITE_API_URL;

export const adminProductsApi = createApi({
    reducerPath: "adminProductsApi",

    tagTypes: ["Products"],

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
        // Get Single Product
        getSingleProduct: builder.query<
            StrapiSingleResponse<IProduct>,
            { lang: string; documentId: string }
        >({
            query: ({ lang, documentId }) =>
                `/products/${documentId}?locale=${lang}&populate=*`,
        }),

        /* =========================
           CREATE PRODUCT
        ========================= */
        createProduct: builder.mutation({
            query: (body) => ({
                url: "/products",
                method: "POST",
                body: {
                    data: body,
                },
            }),

            invalidatesTags: ["Products"],
        }),
        // CREATE PRODUCT TRANSLATION
        addProductTranslation: builder.mutation({
            query: ({
                documentId,
                locale,
                title,
                description,
                categories,
                thumbnail
            }) => ({
                url: `/products/${documentId}?locale=${locale}`,
                method: "PUT",
                body: {
                    data: { title, description, categories, thumbnail },
                },
            }),
        }),
        /* =========================
           UPDATE PRODUCT
        ========================= */
        updateProduct: builder.mutation({
            query: ({
                documentId,
                locale,
                body,
            }) => ({
                url: `/products/${documentId}?locale=${locale}`,
                method: "PUT",
                body: {
                    data: body
                },
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
    useGetSingleProductQuery,
    useCreateProductMutation,
    useAddProductTranslationMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = adminProductsApi;