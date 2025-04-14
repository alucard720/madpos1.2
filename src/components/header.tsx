"use client"

import { useAuth } from "../contexts/auth-context"
import { useUser } from "../contexts/user-context"
import { useState } from "react"

type HeaderProps = {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { userProfile } = useUser()
  const { logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
      <h1 className="fs-4 fw-bold text-dark mb-0">{title}</h1>
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link text-decoration-none text-secondary">
          <span className="small">Ayud</span>
        </button>
        <div className="dropdown">
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar">{userProfile.avatar}</div>
            <div className="small">
              <div className="fw-medium">{userProfile.name}</div>
              <div className="text-secondary small">{userProfile.email}</div>
            </div>
            <i className="fas fa-chevron-down text-secondary small"></i>
          </div>

          <div className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""}`}>
            <button className="dropdown-item d-flex align-items-center" onClick={logout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
