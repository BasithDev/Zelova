export const calculateItemPrice = (cartItem) => {
    const originalPrice = cartItem.itemPrice * cartItem.quantity;
    const offer = cartItem.item.offers;
    
    if (offer && cartItem.quantity >= offer.requiredQuantity) {
        const discount = (originalPrice * offer.discountAmount) / 100;
        return {
            original: originalPrice,
            discounted: originalPrice - discount,
            hasDiscount: true
        };
    }
    return {
        original: originalPrice,
        discounted: originalPrice,
        hasDiscount: false
    };
};

export const calculateItemTotal = (cartData) => {
    if (!cartData?.items) return 0;
    
    return cartData.items.reduce((total, cartItem) => {
        const price = calculateItemPrice(cartItem);
        return total + price.discounted;
    }, 0);
};
