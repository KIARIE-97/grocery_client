import type { TCartItem } from "@/types/product.types";
import { createContext, useContext, useReducer, type ReactNode } from "react";
import { toast } from "sonner";

interface CartState {
  items: TCartItem[];
}

type Action =
  | { type: "ADD_TO_CART"; payload: TCartItem }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      toast.success("Item added to cart");
      localStorage.setItem("cartItems", JSON.stringify([...state.items, action.payload]));
    
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };

    case "REMOVE_FROM_CART":
      toast.success("Item removed from cart");
      localStorage.removeItem("cartItems");
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };

    case "CLEAR_CART":
      localStorage.removeItem("cartItems");
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
