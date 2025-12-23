import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    brand?: string;
    category: { _id: string; name: string } | string;
    sizes?: string[];
    colors?: string[];
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

interface WishlistProviderProps {
    children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
        // Load from localStorage on initial render
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlistItems((prev) => {
            // Check if already in wishlist
            if (prev.some((i) => i._id === item._id)) {
                return prev;
            }
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlistItems((prev) => prev.filter((item) => item._id !== id));
    };

    const isInWishlist = (id: string) => {
        return wishlistItems.some((item) => item._id === id);
    };

    const clearWishlist = () => {
        setWishlistItems([]);
    };

    const value = {
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlistItems.length,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistContext;
