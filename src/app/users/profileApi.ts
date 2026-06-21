import type { ICustomerProfile, IUserProfile, StrapiResponse } from "@/interfaces";
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
        getProfile: builder.query<IUserProfile, { id: number }>({
            query: (id) => `/users/${id}?populate=*`,
            providesTags: ["Profile"],
        }),

        getCustomerByUser: builder.query({
            query: (id) => `/customers?populate=*&filters[user][id][$eq]=${id}`,
            transformResponse: (response: StrapiResponse<ICustomerProfile>) => response.data?.[0] ?? null,
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

        addCustomer: builder.mutation({
            query: (body) => ({
                url: "/customers",
                method: "POST",
                body: {
                    data: body,
                },
            }),

            invalidatesTags: ["Profile"],
        }),

        updateCustomer: builder.mutation({
            query: ({
                documentId,
                body,
            }) => ({
                url: `/customers/${documentId}`,
                method: "PUT",
                body: {
                    data: body,
                },
            }),

            invalidatesTags: ["Profile"],
        }),

        changePassword: builder.mutation({
            query: (body) => ({
                url: "/auth/change-password",
                method: "POST",
                body,
            }),
        })
    }),
});

export const {
    useGetProfileQuery,
    useGetCustomerByUserQuery,
    useUpdateProfileMutation,
    useAddCustomerMutation,
    useUpdateCustomerMutation,
    useChangePasswordMutation
    // useUploadFileMutation
} = userProfileApi;