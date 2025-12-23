import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    _id: string;
    product: string; // product ID
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
    stock: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (id: string, size?: string, color?: string) => void;
    updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    taxAmount: number;
    shippingAmount: number;
    grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

// Generate unique key for cart item based on product, size, and color
const getCartItemKey = (productId: string, size?: string, color?: string) => {
    return `${productId}-${size || 'none'}-${color || 'none'}`;
};

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        const quantity = item.quantity || 1;

        setCartItems((prev) => {
            // Check if item with same product, size, and color exists
            const existingIndex = prev.findIndex(
                (i) => i.product === item.product && i.size === item.size && i.color === item.color
            );

            if (existingIndex >= 0) {
                // Update quantity
                const updated = [...prev];
                const newQuantity = updated[existingIndex].quantity + quantity;
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: Math.min(newQuantity, item.stock),
                };
                return updated;
            }

            // Add new item
            return [...prev, { ...item, quantity, _id: getCartItemKey(item.product, item.size, item.color) }];
        });
    };

    const removeFromCart = (productId: string, size?: string, color?: string) => {
        setCartItems((prev) =>
            prev.filter(
                (item) => !(item.product === productId && item.size === size && item.color === color)
            )
        );
    };

    const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
        if (quantity <= 0) {
            removeFromCart(productId, size, color);
            return;
        }

        setCartItems((prev) =>
            prev.map((item) => {
                if (item.product === productId && item.size === size && item.color === color) {
                    return { ...item, quantity: Math.min(quantity, item.stock) };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = cartTotal * 0.1; // 10% tax
    const shippingAmount = cartTotal > 100 ? 0 : 10; // Free shipping over $100
    const grandTotal = cartTotal + taxAmount + shippingAmount;

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        taxAmount,
        shippingAmount,
        grandTotal,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
