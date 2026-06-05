import type { StrapiCategory, StrapiResponse } from "@/interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;


export const categoryApi = createApi({
    reducerPath: "categoryApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api`,
    }),

    endpoints: (builder) => ({
        getCategories: builder.query<StrapiResponse<StrapiCategory>, { lang: string }>({
            query: ({ lang }) => {
                return `/categories?populate[products][populate]=*&locale=${lang}`;
            }
        }),
    }),
});

export const { useGetCategoriesQuery } = categoryApi;

