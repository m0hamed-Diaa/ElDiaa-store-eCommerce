import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const usersApi = createApi({
    reducerPath: "usersApi",

    tagTypes: ["Users"],

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api`,

        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");

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
        getUsers: builder.query({
            query: () => "/users",

            providesTags: ["Users"],
        }),

        getUser: builder.query({
            query: (id) => `/users/${id}`,
        }),

        createUser: builder.mutation({
            query: (body) => ({
                url: "/users",
                method: "POST",
                body,
            }),

            invalidatesTags: ["Users"],
        }),

        updateUser: builder.mutation({
            query: ({ id, body }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body,
            }),

            invalidatesTags: ["Users"],
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApi;