import type { TCartItem } from '@/types/product.types'
import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { toast } from 'sonner'

interface CartState {
  items: TCartItem[]
}

type Action =
  | { type: 'ADD_TO_CART'; payload: TCartItem }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<Action>
} | null>(null)

const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (existing) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
        localStorage.setItem('cartItems', JSON.stringify(updatedItems))
        // toast.success('Item quantity increased')
        return { ...state, items: updatedItems }
      }
      const newItems = [...state.items, { ...action.payload, quantity: 1 }]
      localStorage.setItem('cartItems', JSON.stringify(newItems))
      toast.success('Item added to cart')
      return { ...state, items: newItems }

    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload,
      )
      localStorage.setItem('cartItems', JSON.stringify(filteredItems))
      toast.success('Item removed from cart')
      return { ...state, items: filteredItems }

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        // If quantity is 0 or less, remove the item
        const filteredItems = state.items.filter(
          (item) => item.id !== action.payload.id,
        )
        localStorage.setItem('cartItems', JSON.stringify(filteredItems))
        toast.success('Item removed from cart')
        return { ...state, items: filteredItems }
      }
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item,
      )
      localStorage.setItem('cartItems', JSON.stringify(updatedItems))
      return { ...state, items: updatedItems }

    case 'CLEAR_CART':
      localStorage.removeItem('cartItems')
      toast.success('Cart cleared')
      return { ...state, items: [] }

    default:
      return state
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Load cart from localStorage on initial render
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems')
      return { items: savedCart ? JSON.parse(savedCart) : [] }
    }
    return { items: [] }
  })

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
