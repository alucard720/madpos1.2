"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CartItem } from "../components/cart-item"
import { useCart } from "../contexts/cart-context"
import { useUser } from "../contexts/user-context"
import { formatCurrency } from "../lib/utils"
import { faShoppingCart,faChevronRight } from "@fortawesome/free-solid-svg-icons"

export function CartSidebar() {
  const { cart, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart()
  const { customerName } = useUser()

  // Process checkout
  const processCheckout = () => {
    if (cart.length === 0) return

    alert(`Procesando pago de ${formatCurrency(cartTotal)}`)
    // Here you would typically send the order to your backend
    clearCart()
  }

  return (
    <div className="bg-white border-start d-flex flex-column" style={{ width: "320px" }}>
      <div className="p-2 border-bottom d-flex justify-content-between align-items-center">
        <div className="small fw-medium">{customerName}</div>
        
      
      </div>

      {isCartOpen && (
        <>
          {cart.length > 0 ? (
            <div className="flex-grow-1 overflow-auto">
              <div className="p-4">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              <div className="border-t p-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Subtotal:</span>
                  <span className="fw-medium">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-secondary">Total:</span>
                  <span className="fw-bold fs-5">{formatCurrency(cartTotal)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 text-center">
              <div className="bg-light rounded-circle p-4 mb-3">
                <i className="fas fa-shopping-cart fa-2x text-secondary"><FontAwesomeIcon icon={faShoppingCart}/></i>
              </div>
              <h3 className="fw-medium fs-5 mb-1">Tu carrito está vacío.</h3>
              <p className="text-secondary small">Clica en los artículos para añadirlos a la venta.</p>
            </div>
          )}
        </>
      )}

      <div className="p-4 border-t">        
      <button
  className={`btn ${cart.length === 0 ? "btn-secondary" : "btn-success"} w-100 d-flex justify-content-between align-items-center`}
  onClick={processCheckout}
  disabled={cart.length === 0}
>
          <span>Ir al pago</span>
          <i><FontAwesomeIcon icon={faChevronRight}/></i>
        </button>
      </div>
    </div>
  )
}
