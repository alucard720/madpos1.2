"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { authenticateUser, createUser, type User as ApiUser } from "../services/user-service"

enum UserRole {
  cajero = "cajero",
    administrador = "administrador",
    propietario = "propietario",
}


type User = {
  id: string
  name: string
  email: string
  role: UserRole
  lastLogin?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  userRole: UserRole | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to restore auth state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {

    try {
      setIsLoading(true)
      const apiUser = await authenticateUser(email, password)
      

      if(apiUser){
        const userData: User = {
          id: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          role: role,
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }
      
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }

    return false
  }
 

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
   try {
    setIsLoading(true)
    const newUser: ApiUser = {
      id: "temp-id", // Temporary id, replace with actual logic if needed
      username: name,
      name, // Adding the 'name' property
      email,
      password,
      role: role,
      status: "active", // Assuming 'active' is a valid status
      lastLogin: new Date().toISOString(),
      avatar: "", // Adding the 'avatar' property with a default value
    }
    const createdUser = await createUser(newUser)
    return !!createUser
   } catch (error) {
    console.error("Registration failed:", error)
    return false
   }finally {
    setIsLoading(false)
   }
  }

  const logout = () => {
    localStorage.removeItem("user")
    document.cookie = "auth-token=; path=/; max-age=0"
    document.cookie = "user-role=; path=/; max-age=0"
    setUser(null)
    navigate("/login")
  }

  // Helper function to check if user has required role(s)
  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role)
    }

    return user.role === requiredRole
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        userRole: user?.role || null,
        login,
        register,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { UserRole }
