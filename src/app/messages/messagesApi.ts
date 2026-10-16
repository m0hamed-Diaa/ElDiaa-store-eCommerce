import type { ICustomerMessage, StrapiResponse } from "@/interfaces";
import { getAuth } from "@/lib/authCookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const userMessagesApi = createApi({
    reducerPath: "userMessagesApi",

    tagTypes: ["Messages"],

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
        getMessagesByUser: builder.query<
            StrapiResponse<ICustomerMessage>,
            number
        >({
            query: (id) =>
                `/messages?filters[user][id][$eq]=${id}&sort=createdAt:desc&pagination[pageSize]=100`,
            providesTags: ["Messages"],
        }),


        addMessage: builder.mutation({
            query: (body) => ({
                url: "/messages",
                method: "POST",
                body: {
                    data: body,
                },
            }),

            invalidatesTags: ["Messages"],
        }),

    }),
});

export const {
    useGetMessagesByUserQuery,
    useAddMessageMutation,
} = userMessagesApi;