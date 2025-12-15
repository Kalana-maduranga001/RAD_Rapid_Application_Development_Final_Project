import { useCart } from "../context/cartContext"
import { useState } from "react"
import { createOrder } from "../services/order"

export default function Checkout() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  })

  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  // ✅ ORDER IS CREATED HERE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    try {
      setLoading(true)

      // const orderPayload = {
      //   items: cart.map(item => ({
      //     productId: item.product._id,
      //     quantity: item.quantity,
      //     price: item.product.price
      //   })),
      //   shippingInfo,
      //   paymentMethod,
      //   totalAmount: total
      // }

      const orderPayload = {
        items: cart.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        }))
      }

      await createOrder(orderPayload)

      clearCart()
      setSubmitted(true)

    } catch (error) {
      console.error(error)
      alert("Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !submitted)
    return (
      <p className="p-10 text-center text-gray-600">
        Your cart is empty. Add some products before checkout.
      </p>
    )

  if (submitted)
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
        <p className="text-gray-700 mb-4">
          Your order has been placed successfully.
        </p>
      </div>
    )

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="border rounded-lg p-4 space-y-4">
            {cart.map(item => (
              <div key={item.product._id} className="flex gap-4 items-center">
                <img
                  src={item.product.imageUrls[0]}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.title}</h3>
                  <p>Rs. {item.product.price}</p>
                </div>

                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e =>
                    updateQuantity(item.product._id, Number(e.target.value))
                  }
                  className="w-16 border px-2 py-1 rounded"
                />

                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="text-right font-bold text-xl">
              Total: Rs. {total}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name" onChange={handleInputChange} required />
            <input name="email" placeholder="Email" onChange={handleInputChange} required />
            <input name="address" placeholder="Address" onChange={handleInputChange} required />
            <input name="city" placeholder="City" onChange={handleInputChange} required />
            <input name="postalCode" placeholder="Postal Code" onChange={handleInputChange} required />
            <input name="country" placeholder="Country" onChange={handleInputChange} required />

            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="card">Credit / Debit Card</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
