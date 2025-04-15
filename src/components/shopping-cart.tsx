"use client"

import type React from "react"
import { useAppContext } from "../contexts/app-context"

const ShoppingCart: React.FC = () => {
  const { cartItems, removeFromCart } = useAppContext()

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0)
  }

  return (
    <div className="bg-white border-start d-flex flex-column" style={{ width: "320px" }}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>HECMANUEL</span>
        <button className="btn-close"></button>
      </div>
      <div className="card-body" style={{ height: "500px", overflowY: "auto" }}>
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-3">
              <img
                src="/placeholder.svg?height=100&width=100"
                alt="Empty cart"
                className="img-fluid"
                style={{ opacity: 0.5 }}
              />
            </div>
            <h5>Tu carrito está vacío.</h5>
            <p className="text-muted">Clica en los artículos para añadirlos a la venta.</p>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div>{item.name}</div>
                  <div className="text-muted">RD${item.price.toFixed(2)}</div>
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="card-footer">
        <div className="d-grid gap-2">
          <button
            className="btn btn-primary d-flex justify-content-between align-items-center"
            disabled={cartItems.length === 0}
          >
            <span>Ir al pago</span>
            <span>RD${calculateTotal().toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart
