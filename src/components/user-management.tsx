"use client"

import type React from "react"

import { useState } from "react"
import { useAuth, type UserRole } from "../contexts/auth-context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

// Mock users data
const mockUsers = [
  {
    id: "user_001",
    name: "Miguel Santana",
    email: "admin@example.com",
    role: "administrator" as UserRole,
    lastLogin: "2023-05-15 10:30",
    status: "Activo",
  },
  {
    id: "user_002",
    name: "Ana Martínez",
    email: "ana.martinez@example.com",
    role: "cashier" as UserRole,
    lastLogin: "2023-05-14 09:15",
    status: "Activo",
  },
  {
    id: "user_003",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    role: "cashier" as UserRole,
    lastLogin: "2023-05-13 14:20",
    status: "Inactivo",
  },
  {
    id: "user_004",
    name: "Laura Gómez",
    email: "laura.gomez@example.com",
    role: "cashier" as UserRole,
    lastLogin: "2023-05-12 11:45",
    status: "Activo",
  },
  {
    id: "user_005",
    name: "Roberto Sánchez",
    email: "roberto.sanchez@example.com",
    role: "administrator" as UserRole,
    lastLogin: "2023-05-11 16:30",
    status: "Activo",
  },
]

interface UserManagementProps {
  compact?: boolean
}

export function UserManagement({ compact = false }: UserManagementProps) {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
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
    role: "cashier",
    password: "",
    status: "Activo",
  })

  const { register } = useAuth()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // For compact mode, limit to 5 users
  const displayedUsers = compact ? filteredUsers.slice(0, 5) : filteredUsers

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentUser({ ...currentUser, [name]: value })
  }

  const handleAddUser = () => {
    setCurrentUser({
      name: "",
      email: "",
      role: "cashier",
      password: "",
      status: "Activo",
    })
    setShowModal(true)
  }

  const handleEditUser = (user: (typeof mockUsers)[0]) => {
    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", // We don't show the password when editing
      status: user.status,
    })
    setShowModal(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentUser.id) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === currentUser.id
            ? {
                ...user,
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                status: currentUser.status,
              }
            : user,
        ),
      )
    } else {
      // Add new user
      try {
        // In a real app, this would call an API
        // For demo purposes, we'll just add to our local state
        const newUser = {
          id: `user_${Math.floor(Math.random() * 1000)}`,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          lastLogin: "-",
          status: currentUser.status,
        }

        setUsers([...users, newUser])

        // Register the user in auth context (in a real app)
        // This is just for demonstration
        await register(currentUser.name, currentUser.email, currentUser.password, currentUser.role)
      } catch (error) {
        console.error("Error creating user:", error)
        alert("Error al crear el usuario")
        return
      }
    }

    setShowModal(false)
  }

  return (
    <div>
      {!compact && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fs-4 fw-semibold">Gestión de Usuarios</h2>
          <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleAddUser}>
            <i className="fas fa-plus"></i>
            <span>Añadir Usuario</span>
          </button>
        </div>
      )}

      {!compact && (
        <div className="mb-4 position-relative">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i><FontAwesomeIcon icon={faSearch}/></i>
            </span>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className={compact ? "" : "card shadow-sm"}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>
                {!compact && <th scope="col">Último Acceso</th>}
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="fw-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === "administrator" ? "bg-primary" : "bg-secondary"}`}>
                      {user.role === "administrator" ? "Administrador" : "Cajero"}
                    </span>
                  </td>
                  {!compact && <td className="text-secondary">{user.lastLogin}</td>}
                  <td>
                    <span className={`badge ${user.status === "Activo" ? "bg-success" : "bg-danger"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditUser(user)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user.id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {compact && filteredUsers.length > 5 && (
          <div className="p-3 text-center border-top">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => window.location.href = "/usuarios"}
            >
              Ver todos los usuarios <i className="fas fa-arrow-right ms-1"></i>
            </button>
          </div>
        )}

        {compact && (
          <div className="p-3 text-end border-top">
            <button className="btn btn-success btn-sm" onClick={handleAddUser}>
              <i className="fas fa-plus me-1"></i> Añadir Usuario
            </button>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{currentUser.id ? "Editar Usuario" : "Añadir Usuario"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={currentUser.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={currentUser.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Rol
                    </label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={currentUser.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="cashier">Cajero</option>
                      <option value="administrator">Administrador</option>
                    </select>
                  </div>
                  {!currentUser.id && (
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={currentUser.password}
                        onChange={handleInputChange}
                        required={!currentUser.id}
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={currentUser.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    {currentUser.id ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
