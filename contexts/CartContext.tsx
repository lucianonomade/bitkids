
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, size: string, quantity?: number) => void;
    removeFromCart: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('bittkids_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('bittkids_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: Product, size: string, quantity: number = 1) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.product.id === product.id && item.size === size
            );

            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            }

            return [...prevItems, { product, size, quantity }];
        });
    };

    const removeFromCart = (productId: string, size: string) => {
        setCartItems(prevItems =>
            prevItems.filter(item => !(item.product.id === productId && item.size === size))
        );
    };

    const updateQuantity = (productId: string, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }

        setCartItems(prevItems => {
            return prevItems.map(item =>
                (item.product.id === productId && item.size === size)
                    ? { ...item, quantity }
                    : item
            );
        });
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
