import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const authApiSlice = createApi({
    reducerPath: "authApiSlice",

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api`,
        credentials: "include",
    }),

    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: "/auth/local",
                method: "POST",
                body,
            }),
        }),

        register: builder.mutation({
            query: (body) => ({
                url: "/auth/local/register",
                method: "POST",
                body,
            }),
        }),

        forgotPassword: builder.mutation({
            query: (email) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body: { email },
            }),
        }),

        resetPassword: builder.mutation({
            query: (body) => ({
                url: "/auth/reset-password",
                method: "POST",
                body,
            }),
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
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
} = authApiSlice;