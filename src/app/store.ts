import { configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

const storage = {
    getItem: (key: string) =>
        Promise.resolve(localStorage.getItem(key)),
    setItem: (key: string, value: string) =>
        Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key: string) =>
        Promise.resolve(localStorage.removeItem(key)),
};

import internetSlice from "./features/Internet/internetSlice";
import cartReducer from "./features/cartSlice";
import uiSlice from "./features/uiSlice";
import heartSlice from "./features/heartSlice";
import languageSlice from "./features/language/languageSlice";
import { productsApi } from "./products/user/productsApi";
import { heroSlideApi } from "./hero-slides/user/heroSlice";
import { categoryApi } from "./categories/user/categoryApi";
import { adminProductsApi } from "./products/admin/productsApi";
import { adminCategoriesApi } from "./categories/admin/categoryApi";
import { adminHeroSlidesApi } from "./hero-slides/admin/heroSlice";
import { authApiSlice } from "./users/authApi";
import { userProfileApi } from "./users/profileApi";
import { uploadApi } from "./features/Upload/uploadApi";

const cartPersistConfig = {
    key: "cart",
    storage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
    reducer: {
        language: languageSlice,
        internet: internetSlice,
        cart: persistedCartReducer,
        ui: uiSlice,
        heart: heartSlice,
        [productsApi.reducerPath]: productsApi.reducer,
        [adminProductsApi.reducerPath]: adminProductsApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [adminCategoriesApi.reducerPath]: adminCategoriesApi.reducer,
        [heroSlideApi.reducerPath]: heroSlideApi.reducer,
        [adminHeroSlidesApi.reducerPath]: adminHeroSlidesApi.reducer,
        // Authentication and User Profile
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [userProfileApi.reducerPath]: userProfileApi.reducer,
        [uploadApi.reducerPath]: uploadApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(productsApi.middleware, adminProductsApi.middleware, categoryApi.middleware, adminCategoriesApi.middleware, heroSlideApi.middleware, adminHeroSlidesApi.middleware, authApiSlice.middleware, userProfileApi.middleware, uploadApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;