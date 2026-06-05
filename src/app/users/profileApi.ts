import { getAuth } from "@/lib/authCookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const userProfileApi = createApi({
    reducerPath: "userProfileApi",

    tagTypes: ["Profile"],

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
        getProfile: builder.query({
            query: (id) => `/users/${id}?populate=*`,
            providesTags: ["Profile"],
        }),

        updateProfile: builder.mutation({
            query: ({ id, body }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body,
            }),

            invalidatesTags: ["Profile"],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
} = userProfileApi;