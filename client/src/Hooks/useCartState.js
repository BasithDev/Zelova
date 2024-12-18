import { useState } from 'react';

export const useCartState = (initialUserAddress, initialUserPhone) => {
    const [cartState, setCartState] = useState({
        coupons: [],
        showCoupons: false,
        couponCode: '',
        appliedCoupon: null,
        couponError: '',
        showAddresses: false,
        selectedAddress: '',
        deliveryAddress: initialUserAddress,
        phoneNumber: initialUserPhone,
        isUsingCurrentLocation: false
    });

    const updateCartState = (updates) => {
        setCartState(prev => ({ ...prev, ...updates }));
    };

    return [cartState, updateCartState];
};
