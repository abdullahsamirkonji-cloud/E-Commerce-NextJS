"use client";
import { createContext, ReactNode, useState } from "react";

interface CartContextValues {
  numOfCartItems: number;
  setNumOfCartItems: (num: number) => void;
}

export const CartContext = createContext<CartContextValues>({
  numOfCartItems: 0,
  setNumOfCartItems: () => {},
});

export default function CartContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  return (
    <CartContext.Provider value={{ numOfCartItems, setNumOfCartItems }}>
      {children}
    </CartContext.Provider>
  );
}
