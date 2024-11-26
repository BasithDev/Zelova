import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateCartItem as updateCartAPI, getCart, removeCartItem as removeCartItemAPI } from '../../../Services/apiServices';

// Thunk for updating the cart
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ itemId, quantity, customizations }, { rejectWithValue }) => {
        try {
            const response = await updateCartAPI({ itemId, quantity, customizations });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

// Thunk for removing an item from the cart
export const removeCartItem = createAsyncThunk(
    'cart/removeCartItem',
    async ({ cartId, itemId }, { rejectWithValue }) => {
        try {
            await removeCartItemAPI(cartId, itemId);
            return { itemId };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

// Thunk for fetching the cart
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCart();
            return response.data; // Assumes API returns the cart directly
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartId: null,
        items: [],
        totalItems: 0,
        totalAmount: 0,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.cartId = null;
            state.items = [];
            state.totalItems = 0;
            state.totalAmount = 0;
            state.status = 'idle';
            state.error = null;
        },
        removeItem(state, action) {
            const itemId = action.payload;
            state.items = state.items.filter(item => item.itemId !== itemId);
            // Recalculate total items and total amount after removal
            state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalAmount = state.items.reduce((sum, item) => {
                const basePrice = item.price || 0;
                const customizationTotal = item.customizations
                    ? item.customizations.reduce((total, customization) => {
                          const optionPrice = customization.option?.price || 0;
                          return total + optionPrice;
                      }, 0)
                    : 0;
                return sum + (basePrice + customizationTotal) * item.quantity;
            }, 0);
        },
    },
    extraReducers: (builder) => {
        builder
            // Update Cart Item
            .addCase(updateCartItem.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                const { totalItems, itemQuantity } = action.payload;
                const updatedItem = action.meta.arg;

                state.totalItems = totalItems;

                const itemIndex = state.items.findIndex(
                    (item) => item.itemId === updatedItem.itemId
                );

                if (itemIndex > -1) {
                    // Update existing item quantity and customizations
                    state.items[itemIndex].quantity = itemQuantity;
                    if (updatedItem.customizations) {
                        state.items[itemIndex].customizations = updatedItem.customizations;
                    }
                } else {
                    // Add new item to the cart
                    state.items.push({
                        itemId: updatedItem.itemId,
                        quantity: itemQuantity,
                        customizations: updatedItem.customizations || [],
                        price: updatedItem.price || 0,
                    });
                }

                // Recalculate total amount
                state.totalAmount = state.items.reduce((sum, item) => {
                    const basePrice = item.price || 0;
                    const customizationTotal = item.customizations
                        ? item.customizations.reduce((total, customization) => {
                              const optionPrice = customization.option?.price || 0; // Access the option price directly
                              return total + optionPrice;
                          }, 0)
                        : 0;
                    return sum + (basePrice + customizationTotal) * item.quantity;
                }, 0);
                

                state.status = 'succeeded';
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Remove Cart Item
            .addCase(removeCartItem.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                const itemId = action.payload.itemId;
                state.items = state.items.filter(item => item.itemId !== itemId);
                state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
                state.totalAmount = state.items.reduce((sum, item) => {
                    const basePrice = item.price || 0;
                    const customizationTotal = item.customizations
                        ? item.customizations.reduce((total, customization) => {
                              const optionPrice = customization.option?.price || 0; // Access the option price directly
                              return total + optionPrice;
                          }, 0)
                        : 0;
                    return sum + (basePrice + customizationTotal) * item.quantity;
                }, 0);
                state.status = 'succeeded';
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                const { _id, items, totalItems, totalAmount } = action.payload;
                state.cartId = _id;
                state.items = items;
                state.totalItems = totalItems;
                state.totalAmount = totalAmount;
                state.status = 'succeeded';
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearCart, removeItem } = cartSlice.actions;

export default cartSlice.reducer;
