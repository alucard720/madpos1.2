"use client"


import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useCart } from "../contexts/cart-context"
import { formatCurrency } from "../lib/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type CartItemProps = {
  item: {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="d-flex py-3 border-bottom">
      <div className="bg-light rounded me-3 overflow-hidden" style={{ width: "64px", height: "64px" }}>
        {item.image ? (
          <img
            src={item.image || "/placeholder.svg"}
            width={64}
            height={64}
            alt={item.name}
            className="cart-item-image"
          />
        ) : (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-secondary">
            <span className="small">Sin imagen</span>
          </div>
        )}
      </div>

      <div className="flex-grow-1">
        <div className="d-flex justify-content-between">
          <h4 className="fw-medium small">{item.name}</h4>
          <button className="btn btn-sm text-secondary border-0 p-0" onClick={() => removeFromCart(item.id)}>
            <i ><FontAwesomeIcon icon={faTrash}/></i>
          </button>
        </div>

        <div className="text-secondary small">{formatCurrency(item.price)}</div>

        <div className="d-flex align-items-center justify-content-between mt-2">
          <div className="input-group input-group-sm" style={{ width: "auto" }}>
            <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
              <i><FontAwesomeIcon icon={faMinus}/></i>
            </button>
            <span className="input-group-text bg-white">{item.quantity}</span>
            <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              <i><FontAwesomeIcon icon={faPlus}/></i>
            </button>
          </div>

          <div className="fw-medium">{formatCurrency(item.price * item.quantity)}</div>
        </div>
      </div>
    </div>
  )
}
