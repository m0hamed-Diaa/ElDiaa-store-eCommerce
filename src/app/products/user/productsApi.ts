import type { IProduct, StrapiResponse, StrapiSingleResponse } from "@/interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;


export const productsApi = createApi({
    reducerPath: "productsApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api`,
    }),

    endpoints: (builder) => ({
        getProducts: builder.query<StrapiResponse<IProduct>, {
            lang: string; search?: string, page?: number; pageSize?: number, sort?: "asc" | "desc"; category?: string | null; discount?: boolean; documentId?: string
        }>({
            query: ({ lang, search, page = 1, pageSize = 8, sort, category, discount }) => {

                const params = `/products?populate=*&locale=${lang}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

                const searchQuery = search
                    ? `&filters[title][$containsi]=${search}`
                    : "";
                const sortQuery = sort ? `&sort=createdAt:${sort}` : "";

                const categoryFilter = category
                    ? `&filters[categories][documentId][$eq]=${category}`
                    : "";

                const discountFilter = discount
                    ? `&filters[discount][$gt]=0`
                    : "";


                return params + categoryFilter + discountFilter + searchQuery + sortQuery;
            },
        }), getSingleProduct: builder.query<
            StrapiSingleResponse<IProduct>,
            { lang: string; documentId: string }
        >({
            query: ({ lang, documentId }) =>
                `/products/${documentId}?locale=${lang}&populate=*`,
        })
    }),
});

export const { useGetProductsQuery, useGetSingleProductQuery } = productsApi;

