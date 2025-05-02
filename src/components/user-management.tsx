"use client"


import { useEffect, useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"
import { fetchUsers, createUser, updateUser, deleteUser, UserRole, type User } from "../services/user-service"
import { Tab, Nav } from "react-bootstrap"



interface Permissions {
  label: string
  description: string
  canManage: UserRole[]
  badge: string
}



// Define permission levels for each role
const rolePermissions : Record<UserRole, Permissions> = {

  [UserRole.propietario]: {
    label: "Propietario",
    description: "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
    canManage: [UserRole.cajero, UserRole.propietario],
    badge: "bg-danger",
  },
  [UserRole.administrador]: {
    label: "Administrador",
    description: "Acceso a la mayoría de funciones administrativas, excepto configuraciones financieras sensibles.",
    canManage: [UserRole.administrador, UserRole.cajero, UserRole.propietario],
    badge: "bg-primary",
  },
  [UserRole.cajero]: {
    label: "Cajero",
    description: "Acceso limitado a ventas, pedidos y clientes.",
    canManage: [],
    badge: "bg-secondary",
  },
}

interface CurrentUser{
  id?: string
  name: string
  email: string
  role: UserRole
  password: string
  status: string
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
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: "",
    email: "",
    role: "" as UserRole,
    password: "",
    status: "Activo",
  })

  
  const {user: currentAuthUser, register} = useAuth()

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchUsers()
        setUsers(data)
        setFilteredUsers(data)
      } catch (err) {
        setError(`Error al cargar usaurios: ${err instanceof Error ? err.message : "Error desconocido"}. Por favor, intenta de nuevo.`)
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
  setCurrentUser({ ...currentUser, [name as keyof CurrentUser]: name === "role" ? (value as UserRole) : value })
}

const handleAddUser =() => {
  setCurrentUser({
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

const canManageRole = (role: UserRole): boolean => {
  if (!currentAuthUser) return false

  // Owner can manage all roles
  if (currentAuthUser.role === "propietario") return true

  // Administrator can only manage cashiers
  if (currentAuthUser.role === "administrador") return role === "cajero"

  // Cashiers can't manage any roles
  return false
}


 const getRoleLabel=(role: UserRole): string => {
  return rolePermissions[role]?.label;
}

const isCurrentUser=(userId: string ): boolean => {
  return currentAuthUser?.id === userId
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
  setError(null);
  setIsLoading(true)
  

  try {
    if(currentUser.id){
      // update existing user
     const updatedUser = await updateUser(currentUser.id,{
       name: currentUser.name,
       id: "",
       username: "",
       email: currentUser.email,
       password: currentUser.password,
       role: currentUser.role,
       status: currentUser.status,
       lastLogin: new Date().toISOString(),
       avatar: ""
     });
     if (updatedUser) {
       setUsers(users.map((user) => (user.id === currentUser.id ? updatedUser : user)))
       setFilteredUsers(filteredUsers.map((user) => (user.id === currentUser.id ? updatedUser : user)))
     }else{
      throw new Error("Error al actualizar el usuario")
      }
      //add new user
      const newUser = await createUser({
        name: currentUser.name,
        id: "",
        username: "",
        email: currentUser.email,
        password: currentUser.password,
        role: currentUser.role,
        status: currentUser.status,
        lastLogin: new Date().toISOString(),
        avatar: ""
      });
      setShowModal(false);
    }else{
      throw new Error("Error al crear el usuario")
    }
  } catch (error) {
    console.error("Error al guardar el usuario:", error)
    setError("Error al guardar el usuario. Por favor, intenta de nuevo.")
  }finally {
    setIsLoading(false)
  }
}
// Count users by role
const userCounts = {
  all: users.length,
  owner: users.filter((user) => user.role === "propietario").length,
  administrator: users.filter((user) => user.role === "administrador").length,
  cashier: users.filter((user) => user.role === "cajero").length,
};

if (isLoading && users.length === 0) {
  return (
    <div className="text-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="mt-2">Cargando usuarios...</p>
    </div>
  );
}

// For compact mode, limit to 5 users
const displayedUsers = compact ? filteredUsers.slice(0, 5) : filteredUsers;


if (compact) {
  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Email</th>
              <th scope="col">Rol</th>
              <th scope="col">Estado</th>
              <th scope="col" className="text-end">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="fw-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "propietario"
                          ? "bg-danger"
                          : user.role === "administrador"
                            ? "bg-primary"
                            : "bg-secondary"
                      }`}
                    >
                      {`badge $rolePermissions[user.role]?.label || user.role`}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.status === "Activo" ? "bg-success" : "bg-danger"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="text-end">
                    {canManageRole(user.role) && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditUser(user)}
                          disabled={isLoading}
                        >
                          <i><FontAwesomeIcon icon={faEdit}/></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isLoading}
                        >
                          <i><FontAwesomeIcon icon={faTrash}/></i>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredUsers.length > 5 && (
        <div className="p-3 text-center border-top">
          <a href="/usuarios" className="btn btn-sm btn-outline-primary">
            Ver todos los usuarios <i className="fas fa-arrow-right ms-1"></i>
          </a>
        </div>
      )}

      <div className="p-3 text-end border-top">
        <button className="btn btn-success btn-sm" onClick={handleAddUser} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              <span>Cargando...</span>
            </>
          ) : (
            <>
              <i><FontAwesomeIcon icon={faPlus}/></i> Añadir Usuario
            </>
          )}
        </button>
      </div>
    </div>
  )
}

return (
  <div className="container-fluid px-0">
    {error && (
      <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={() => setError(null)}
        ></button>
      </div>
    )}

    <div className="row mb-4">
      <div className="col">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fs-4 fw-semibold mb-0">Gestión de Usuarios</h2>
          <button
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={handleAddUser}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Cargando...</span>
              </>
            ) : (
              <>
               <i><FontAwesomeIcon icon={faPlus}/></i>
                <span>Añadir Usuario</span>
              </>
            )}
          </button>
        </div>

        <p className="text-secondary mb-4">
          Gestiona los usuarios del sistema y sus niveles de acceso. Cada rol tiene diferentes permisos y capacidades.
        </p>
      </div>
    </div>

    <div className="row mb-4">
      <div className="col-md-8">
        <div className="input-group">
          <span className="input-group-text bg-white">
          <i><FontAwesomeIcon icon={faSearch}/></i>
          </span>
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-12">
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k as UserRole | "all")}>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="all" className="d-flex align-items-center">
                <span>Todos</span>
                <span className="badge bg-secondary rounded-pill ms-2">{userCounts.all}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="owner" className="d-flex align-items-center">
                <span>Propietarios</span>
                <span className="badge bg-danger rounded-pill ms-2">{userCounts.owner}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="administrator" className="d-flex align-items-center">
                <span>Administradores</span>
                <span className="badge bg-primary rounded-pill ms-2">{userCounts.administrator}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="cashier" className="d-flex align-items-center">
                <span>Cajeros</span>
                <span className="badge bg-secondary rounded-pill ms-2">{userCounts.cashier}</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey={activeTab}>
              <div className="card shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Rol</th>
                        <th scope="col">Último Acceso</th>
                        <th scope="col">Estado</th>
                        <th scope="col" className="text-end">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="fw-medium">{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span
                                className={`badge ${
                                  user.role === "propietario"
                                    ? "bg-danger"
                                    : user.role === "administrador"
                                      ? "bg-primary"
                                      : "bg-secondary"
                                }`}
                              >
                                {getRoleLabel(user.role)}
                              </span>
                            </td>
                            <td className="text-secondary">{user.lastLogin || "-"}</td>
                            <td>
                              <span className={`badge ${user.status === "Activo" ? "bg-success" : "bg-danger"}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="text-end">
                              {canManageRole(user.role) && (
                                <>
                                  <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEditUser(user)}
                                    disabled={isLoading}
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={isLoading || isCurrentUser(user.id)}
                                    title={
                                      isCurrentUser(user.id)
                                        ? "No puedes eliminar tu propio usuario"
                                        : "Eliminar usuario"
                                    }
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            {searchTerm
                              ? "No se encontraron usuarios que coincidan con la búsqueda"
                              : "No hay usuarios en esta categoría"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>

    <div className="row mt-5">
      <div className="col-12">
        <h3 className="fs-5 fw-semibold mb-3">Roles y Permisos</h3>
        <div className="row">
          {Object.entries(rolePermissions).map(([role, info]) => (
            <div className="col-md-4 mb-3" key={role}>
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{info.label}</h5>
                  <span className={`badge ${info.badge}`}>{role}</span>
                </div>
                <div className="card-body">
                  <p className="card-text">{info.description}</p>
                  <h6 className="mt-3 mb-2">Puede gestionar:</h6>
                  <ul className="list-unstyled">
                    {info.canManage.length > 0 ? (
                      info.canManage.map((managedRole) => (
                        <li key={managedRole} className="mb-1">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {rolePermissions[managedRole as UserRole]?.label || managedRole}
                        </li>
                      ))
                    ) : (
                      <li className="text-muted">
                        <i className="fas fa-times-circle me-2"></i>
                        No puede gestionar usuarios
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
                disabled={isLoading}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
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
                    disabled={isLoading}
                    autoComplete = "off" 
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
                    disabled={isLoading}
                    autoComplete="off"
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
                    disabled={isLoading}
                  >
                    {/* Only show roles the current user can manage */}
                    {currentAuthUser?.role === "propietario" && <option value="owner">Propietario</option>}
                    {(currentAuthUser?.role === "propietario" || currentAuthUser?.role === "administrador") && (
                      <option value="administrator">Administrador</option>
                    )}
                    <option value="cashier">Cajero</option>
                  </select>
                  <div className="form-text">
                    {rolePermissions[currentUser.role]?.description || "Selecciona un rol para ver su descripción"}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {currentUser.id ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={currentUser.password}
                    onChange={handleInputChange}
                    required={!currentUser.id}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
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
                    disabled={isLoading}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {currentUser.id ? "Actualizando..." : "Creando..."}
                    </>
                  ) : currentUser.id ? (
                    "Actualizar"
                  ) : (
                    "Crear"
                  )}
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