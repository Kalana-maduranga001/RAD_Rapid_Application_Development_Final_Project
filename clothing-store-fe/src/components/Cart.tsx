import { FiX } from "react-icons/fi"
import { useCart } from "../context/cartContext"
import { useNavigate } from "react-router-dom"

type Props = {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity } = useCart()

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  if (!open) return null

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white z-50 shadow-xl flex flex-col animate-slideIn">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.product._id}
                className="flex gap-4 mb-4 border-b pb-4"
              >
                <img
                  src={item.product.imageUrls[0]}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {item.product.title}
                  </h3>
                  <p className="text-sm">
                    Rs. {item.product.price}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="border px-2"
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="border px-2"
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(item.product._id)
                  }
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between font-bold mb-4">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>

            <button
              className="w-full bg-black text-white py-3 rounded"
              onClick={() => {
                onClose()         // Close the drawer
                navigate("/checkout") // Navigate to checkout page
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}
