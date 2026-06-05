import type { RootState } from "@/app/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface HeartState {
    items: number[];
}

const loadFromLocalStorage = (): number[] => {
    try {
        const data = localStorage.getItem("heartItems");

        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.log(error)
        return [];
    }
};

const saveToLocalStorage = (items: number[]) => {
    localStorage.setItem("heartItems", JSON.stringify(items));
};

const initialState: HeartState = {
    items: loadFromLocalStorage(),
};

const heartSlice = createSlice({
    name: "heart",
    initialState,
    reducers: {
        toggleHeart: (state, action: PayloadAction<number>) => {
            const productId = action.payload;
            const exists = state.items.includes(productId);
            if (exists) {
                state.items = state.items.filter((id) => id !== productId);
            } else {
                state.items.push(productId);
            }

            saveToLocalStorage(state.items);
        },

        removeHeart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(
                (id) => id !== action.payload
            );

            saveToLocalStorage(state.items);
        },

        clearHeart: (state) => {
            state.items = [];

            saveToLocalStorage([]);
        },
    },
});

export const {
    toggleHeart,
    removeHeart,
    clearHeart,
} = heartSlice.actions;

export const selectIsHeart = (state: RootState) => state.heart.items;


export default heartSlice.reducer;