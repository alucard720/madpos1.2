"use client"


import { useEffect, useState } from "react"
import { useAuth, type UserRole } from "../contexts/auth-context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"
import { fetchUsers, createUser, updateUser, deleteUser, type User } from "../services/user-service"
import { set } from "react-hook-form"

// Define permission levels for each role
const rolePermissions = {
  owner: {
    label: "Propietario",
    description: "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
    canManage: ["administrator", "cashier", "owner"],
    badge: "bg-danger",
  },
  administrator: {
    label: "Administrador",
    description: "Acceso a la mayoría de funciones administrativas, excepto configuraciones financieras sensibles.",
    canManage: ["cashier"],
    badge: "bg-primary",
  },
  cashier: {
    label: "Cajero",
    description: "Acceso limitado a ventas, pedidos y clientes.",
    canManage: [],
    badge: "bg-secondary",
  },
}


interface UserManagementProps {
  compact?: boolean
}

export function UserManagement({ compact = false }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<UserRole | "all">("all")
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<{
    id?: string
    name: string
    email: string
    role: UserRole
    password: string
    status: string
  }>({
    name: "",
    email: "",
    role: "" as UserRole,
    password: "",
    status: "Activo",
  })
  
  useAuth()

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchUsers()
        setUsers(data)
        setFilteredUsers(data)
      } catch (err) {
        setError("Error al cargar usuarios. Por favor, intenta de nuevo.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

 // Filter users when search term or active tab changes
 useEffect(() => {
  let result = users

  // Filter by search term
  if (searchTerm) {
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Filter by role tab
  
if (activeTab !== "all") {
    result = result.filter((user) => user.role === activeTab)
  }
  setFilteredUsers(result)
}, [users, searchTerm, activeTab])

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target
  setCurrentUser({ ...currentUser, [name]: value })
}

const handleAddUser =() => {
  setCurrentUser({
    id: undefined,
    name: "",
    email: "",
    role: "" as UserRole,
    password: "",
    status: "Activo",
  })
  setShowModal(true) 
}

const handleEditUser = (user: User) => {
  setCurrentUser({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    password: "",
    status: user.status,
  })
  setShowModal(true)    
}

const handleDeleteUser = async (userId: string) => {
  if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    setIsLoading(true)
    try {
      await deleteUser(userId)
      setUsers(users.filter((user) => user.id !== userId))
      setFilteredUsers(filteredUsers.filter((user) => user.id !== userId))
    } catch (err) {
      setError("Error al eliminar el usuario. Por favor, intenta de nuevo.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError(null)


}
}