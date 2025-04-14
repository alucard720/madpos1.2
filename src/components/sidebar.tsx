import React from "react"
import { useLocation, Link } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTruck, faCashRegister, faBars, faGifts, faSolarPanel, faCircleUser,faMoneyBillTrendUp } from "@fortawesome/free-solid-svg-icons"


export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const { logout } = useAuth()

  return (
    <aside className="sidebar d-flex flex-column">
      <div className="p-3">
        <FontAwesomeIcon icon={faBars} size="2x"/>
      </div>

      <NavItem
        to="/"
        icon={<FontAwesomeIcon icon={faCashRegister} size="2x" />}
        label="Vender"
        isActive={pathname === "/"}
        highlight
      />

      <NavItem
        to="/pedidos"
        icon={<FontAwesomeIcon icon={faTruck} size="2x"/>}
        label="Pedidos"
        isActive={pathname === "/pedidos"}
        highlight
      />

      <NavItem
        to="/productos"
        icon={<FontAwesomeIcon icon={faGifts} size="2x"/>}
        label="Productos"
        isActive={pathname === "/productos"}
      />

      <NavItem
        to="/catalogo"
        icon={<FontAwesomeIcon icon={faSolarPanel} size="2x" />}
        label="Catálogo"
        isActive={pathname === "/catalogo"}
      />

      <NavItem
        to="/clientes"
        icon={<FontAwesomeIcon icon={faCircleUser} size="2x" />}
        label="Clientes"
        isActive={pathname === "/clientes"}
      />

      <NavItem
        to="/transacciones"
        icon={<FontAwesomeIcon icon={faMoneyBillTrendUp} size="2x" />}
        label="Transacciones"
        isActive={pathname === "/transacciones"}
      />
{/* 
      <NavItem
        to="/finanzas"
        icon={<FontAwesomeIcon icon={faGifts}/>}
        label="Finanzas"
        isActive={pathname === "/finanzas"}
      />

      <NavItem
        to="/estadisticas"
        icon={<i className="fas fa-chart-bar"></i>}
        label="Estadísticas"
        isActive={pathname === "/estadisticas"}
      />

      <NavItem
        to="/usuarios"
        icon={<i className="fas fa-user-friends"></i>}
        label="Usuarios"
        isActive={pathname === "/usuarios"}
      />

      <NavItem
        to="/configuraciones"
        icon={<i className="fas fa-cog"></i>}
        label="Configuraciones"
        isActive={pathname === "/configuraciones"}
      /> */}

      {/* Spacer to push logout to bottom */}
      <div className="flex-grow-1"></div>

      {/* Logout button */}
      <button onClick={logout} className="sidebar-item border-0 bg-transparent mb-3">
        <i className="fas fa-sign-out-alt sidebar-icon"></i>
        <span>Salir</span>
      </button>
    </aside>
  )
}

function NavItem({
  to,
  icon,
  label,
  isActive,
  highlight = false,
}: {
  to: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  highlight?: boolean
}) {
  return (
    <Link
      to={to}
      className={`sidebar-item ${isActive ? "active" : ""} ${highlight && isActive ? "highlight" : ""}`}
    >
      <div className="sidebar-icon">{icon}</div>
      <span>{label}</span>
    </Link>
  )
}