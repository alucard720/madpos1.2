"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { UserAuth } from "../contexts/userAuth"
import { useState } from "react"
import { faChevronDown, faSignOut } from "@fortawesome/free-solid-svg-icons"

type HeaderProps = {
  title: string
}

export function Header({ title }: HeaderProps) {

  const { logout, user } = UserAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const getInitials=(name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }


  return (
    <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
      <h1 className="fs-4 fw-bold text-dark mb-0">{title}</h1>
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link text-decoration-none text-secondary">
          <span className="small">Ayuda</span>
        </button>
        <div className="dropdown">
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar">{user ? getInitials(user.name): "??"}</div>
            <div className="small">
              <div className="fw-medium">{user?.name}</div>
              <div className="text-secondary small">{user?.email || ""}
                {user &&(
                  <span className="badge bg-secondary ms-1">{user.role === "administrator" ? "admin": "Cajero"}</span>
                )}
              </div>
            </div>
            <i><FontAwesomeIcon icon={faChevronDown}/></i>
          </div>

          <div className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""}`}>
            <button className="dropdown-item d-flex align-items-center" onClick={logout}>
              <i className="fas fa-sign-out-alt me-2"><FontAwesomeIcon icon={faSignOut}/></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
