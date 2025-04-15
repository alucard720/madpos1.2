"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Product } from "../lib/product"

interface AppContextType {
  cartItems: Product[]
  searchQuery: string
  selectedCategory: string | null
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product])
  }

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== productId))
  }

  return (
    <AppContext.Provider
      value={{
        cartItems,
        searchQuery,
        selectedCategory,
        addToCart,
        removeFromCart,
        setSearchQuery,
        setSelectedCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
