import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCart, getTotalItemsFromCart, getTotalPriceFromCart, updateCart } from '../Services/apiServices';

export const useCart = () => {
    const queryClient = useQueryClient();

    // Fetch the entire cart
    const { data: cart, isLoading, isError } = useQuery({
        queryKey: ['cart'],
        queryFn: getCart,
        cacheTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 5
    });

    // Fetch total items in cart
    const { data: totalItems, isLoading: totalItemsLoading, isError: totalItemsError } = useQuery({
        queryKey: ['totalItems'],
        queryFn: getTotalItemsFromCart,
        cacheTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 5
    });

    // Fetch total price of cart
    const { data: totalPrice, isLoading: totalPriceLoading, isError: totalPriceError } = useQuery({
        queryKey: ['totalPrice'],
        queryFn: getTotalPriceFromCart,
        cacheTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 5
    });

    // Mutation to update cart
    const updateCartMutation = useMutation({
        mutationFn: updateCart,
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
            queryClient.invalidateQueries(['totalItems']);
            queryClient.invalidateQueries(['totalPrice']);
        },
    });

    return {
        cart,
        isLoading,
        isError,
        totalItems,
        totalItemsLoading,
        totalItemsError,
        totalPrice,
        totalPriceLoading,
        totalPriceError,
        updateCartMutation,
        updatingCart: updateCartMutation.isLoading,
        updateError: updateCartMutation.isError,
        refetch: () => {
            queryClient.invalidateQueries(['cart']);
            queryClient.invalidateQueries(['totalItems']);
            queryClient.invalidateQueries(['totalPrice']);
        },
    };
};