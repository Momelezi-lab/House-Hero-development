import { create } from 'zustand'

interface CartItem {
  category: string
  type: string
  quantity: number
  isWhite: boolean
  pricing: {
    customer_display_price: number
    is_white_applicable: boolean
    color_surcharge_customer: number
  }
}

interface BookingState {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  toggleWhite: (index: number, checked: boolean) => void
  clearCart: () => void
  calculateSubtotal: () => number
  calculateTotal: () => number
}

const CALLOUT_FEE = 100

export const useBookingStore = create<BookingState>((set, get) => ({
  cartItems: [],
  addToCart: (item) => set((state) => ({ cartItems: [...state.cartItems, item] })),
  removeFromCart: (index) =>
    set((state) => ({ cartItems: state.cartItems.filter((_, i) => i !== index) })),
  updateQuantity: (index, quantity) =>
    set((state) => {
      const updated = [...state.cartItems]
      updated[index].quantity = quantity
      return { cartItems: updated }
    }),
  toggleWhite: (index, checked) =>
    set((state) => {
      const updated = [...state.cartItems]
      updated[index].isWhite = checked
      return { cartItems: updated }
    }),
  clearCart: () => set({ cartItems: [] }),
  calculateSubtotal: () => {
    const { cartItems } = get()
    return cartItems.reduce((sum, item) => {
      let price = item.pricing.customer_display_price
      if (item.isWhite && item.pricing.is_white_applicable) {
        price += item.pricing.color_surcharge_customer
      }
      return sum + price * item.quantity
    }, 0)
  },
  calculateTotal: () => {
    const { calculateSubtotal } = get()
    return calculateSubtotal() + CALLOUT_FEE
  },
}))

