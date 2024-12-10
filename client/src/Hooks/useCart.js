import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCart, getTotalItemsFromCart, getTotalPriceFromCart, updateCart } from '../Services/apiServices';
import {toast} from 'react-toastify';
import { useState } from 'react';

export const useCart = () => {
    const queryClient = useQueryClient();
    const [isError, setIsError] = useState(false);

    // Fetch the entire cart
    const { data: cart, isLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: getCart,
        cacheTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 5,
    });

    // Get total items in cart
    const { data: totalItems } = useQuery({
        queryKey: ['totalItems'],
        queryFn: getTotalItemsFromCart,
        cacheTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 5,
    });

    // Get total price in cart
    const { data: totalPrice } = useQuery({
        queryKey: ['totalPrice'],
        queryFn: getTotalPriceFromCart,
        cacheTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 5,
    });

    // Update cart mutation
    const updateCartMutation = useMutation({
        mutationFn: updateCart,
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
            queryClient.invalidateQueries(['totalItems']);
            queryClient.invalidateQueries(['totalPrice']);
        },
        onError: (error) => {
            setIsError(true);
            if (error.response && error.response.status === 400) {
                console.log(error.response.data.message);
                toast.error(error.response.data.message || 'Cannot add items from multiple restaurants');
            } else {
                toast.error('An unexpected error occurred');
            }
        },
    });

    // Reset error state
    const resetError = () => {
        setIsError(false);
    };

    return {
        cart,
        totalItems,
        totalPrice,
        isLoading,
        isError,
        updateCartMutation,
        resetError
    };
};