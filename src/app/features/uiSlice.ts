import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UIState {
    isCartOpen: boolean;
}

const initialState: UIState = {
    isCartOpen: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,

    reducers: {
        openCartDrawer: (state) => {
            state.isCartOpen = true;
        },

        closeCartDrawer: (state) => {
            state.isCartOpen = false;
        },

        toggleCartDrawer: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
    },
});

export const {
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
} = uiSlice.actions;
export const selectIsDrawerOpen = (
    state: RootState
) => state.ui.isCartOpen;

export default uiSlice.reducer;