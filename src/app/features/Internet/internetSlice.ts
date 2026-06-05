import type { RootState } from "@/app/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type InternetState = {
    status: boolean;
};

const initialState: InternetState = {
    status: navigator.onLine,
};

const internetSlice = createSlice({
    name: "internet",

    initialState,

    reducers: {
        setInternetStatus: (state, action: PayloadAction<boolean>) => {
            state.status = action.payload;
        },
    },
});

export const { setInternetStatus } =
    internetSlice.actions;

export const selectInternetStatus = (
    state: RootState
) => state.internet.status;

export default internetSlice.reducer;