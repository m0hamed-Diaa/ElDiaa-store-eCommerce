import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuth } from "@/lib/authCookies";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadApi = createApi({
    reducerPath: "uploadApi",

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
        uploadFiles: builder.mutation({
            query: (files: File[]) => {
                const formData = new FormData();

                files.forEach((file) => {
                    formData.append("files", file);
                });

                return {
                    url: "/upload",
                    method: "POST",
                    body: formData,
                };
            },
        }),
    }),
});

export const {
    useUploadFilesMutation,
} = uploadApi;