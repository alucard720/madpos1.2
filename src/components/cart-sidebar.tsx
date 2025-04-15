"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CartItem } from "../components/cart-item";
import { useCart } from "../contexts/cart-context";
import { useUser } from "../contexts/user-context";
import { formatCurrency } from "../lib/utils";
import { faShoppingCart, faChevronRight, faX } from "@fortawesome/free-solid-svg-icons";

export function CartSidebar() {
  const { cart, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { customerName } = useUser();

  // Process checkout
  const processCheckout = () => {
    if (cart.length === 0) return;

    alert(`Procesando pago de ${formatCurrency(cartTotal)}`);
    clearCart();
  };

  return (
    <div
      className="bg-white border-start flex-column" style={{ width: "320px"}}>
      {/* Header */}
      <div className="p-2 border-bottom d-flex justify-content-between align-items-center">
        <div className="small fw-medium">{customerName}</div>
        <button className="btn btn-sm text-secondary border-0" onClick={() => setIsCartOpen(!isCartOpen)}>
          {isCartOpen ? <i className="fas fa-times"><FontAwesomeIcon icon={faX}/></i> : <i className="fas fa-shopping-cart"><FontAwesomeIcon icon={faShoppingCart}/></i>}
        </button> 
      </div>

      {/* Cart Content */}
      {isCartOpen && (
        <>
          {cart.length > 0 ? (
            <div className="flex-grow-1 ">
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <span className="fw-medium">Productos ({cart.length})</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() => clearCart()} title="Limpiar carrito">
                  <i className="fas fa-trash-alt me-1"></i> Limpiar todo
                </button>
              </div>
              <div className="p-3">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              <div className="border-top p-3">
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
                <i><FontAwesomeIcon icon={faShoppingCart}/></i>
              </div>
              <h3 className="fw-medium fs-5 mb-1">Tu carrito está vacío.</h3>
              <p className="text-secondary small">Clica en los artículos para añadirlos a la venta.</p>
            </div>
          )}
        </>
      )}
  

      {/* Checkout Button - Always Visible */}
      <div className="p-4 border-top">
        <button
          className={`btn w-100 d-flex align-items-center justify-content-between ${
            cart.length > 0 ? "btn-success" : "btn-secondary opacity-50"
          }`}
          onClick={processCheckout}
          disabled={cart.length === 0}
        >
          <span>Ir al pago</span>
          <i><FontAwesomeIcon icon={faChevronRight}/></i>
        </button>
      </div>
    </div>
  );
}