import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UIState {
    isDialogOpen: boolean;
}

const initialState: UIState = {
    isDialogOpen: false,
};

const uiDialogSlice = createSlice({
    name: "dialog",
    initialState,

    reducers: {
        openDialogAdmin: (state) => {
            state.isDialogOpen = true;
        },

        closeDialogAdmin: (state) => {
            state.isDialogOpen = false;
        },

        toggleDialogAdmin: (state) => {
            state.isDialogOpen = !state.isDialogOpen;
        },
    },
});

export const {
    openDialogAdmin,
    closeDialogAdmin,
    toggleDialogAdmin
} = uiDialogSlice.actions;
export const selectIsDialogOpen = (
    state: RootState
) => state.dialog.isDialogOpen;

export default uiDialogSlice.reducer;