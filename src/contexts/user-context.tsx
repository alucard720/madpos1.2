"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type UserContextType = {
  customerName: string
  setCustomerName: (name: string) => void
  userProfile: {
    name: string
    email: string
    avatar: string
    role?: string
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [customerName, setCustomerName] = useState("")
  const [userProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  })

  return (
    <UserContext.Provider
      value={{
        customerName,
        setCustomerName,
        userProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
