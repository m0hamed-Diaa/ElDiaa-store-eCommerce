import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { IProduct } from "@/interfaces";

export interface CartItem extends IProduct {
    quantity: number;
    finalPrice: number;
}

interface CartState {
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
}

const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
};

/* =========================
   Helpers
========================= */
const calculateTotals = (state: CartState) => {
    state.totalQuantity = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    state.totalPrice = state.items.reduce(
        (acc, item) => acc + item.finalPrice * item.quantity,
        0
    );
};

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {
        addToCart: (
            state,
            action: PayloadAction<IProduct>
        ) => {
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id
            );

            if (existingItem) {
                // prevent exceeding stock
                if (
                    existingItem.quantity <
                    existingItem.stock
                ) {
                    existingItem.quantity += 1;
                }
            } else {
                const finalPrice = action.payload.discount
                    ? action.payload.price -
                    (action.payload.price *
                        action.payload.discount) /
                    100
                    : action.payload.price;

                state.items.push({
                    ...action.payload,
                    quantity: 1,
                    finalPrice,
                });
            }

            calculateTotals(state);
        },

        removeFromCart: (
            state,
            action: PayloadAction<number>
        ) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            );

            calculateTotals(state);
        },

        increaseQuantity: (
            state,
            action: PayloadAction<number>
        ) => {
            const item = state.items.find(
                (item) => item.id === action.payload
            );

            if (item && item.quantity < item.stock) {
                item.quantity += 1;
            }

            calculateTotals(state);
        },

        decreaseQuantity: (
            state,
            action: PayloadAction<number>
        ) => {
            const item = state.items.find(
                (item) => item.id === action.payload
            );

            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.items = state.items.filter(
                        (i) => i.id !== item.id
                    );
                }
            }

            calculateTotals(state);
        },

        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.totalQuantity = 0;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlice.actions;

export const selectCartItems = (
    state: RootState
) => state.cart.items;

export const selectCartCount = (
    state: RootState
) => state.cart.totalQuantity;

export const selectCartTotal = (
    state: RootState
) => state.cart.totalPrice;


export default cartSlice.reducer;