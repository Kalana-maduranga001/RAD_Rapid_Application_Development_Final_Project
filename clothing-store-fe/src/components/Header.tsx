import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { FiUser, FiShoppingCart, FiHeart } from "react-icons/fi"
import { useCart } from "../context/cartContext"
import { useState } from "react"
import Cart from "./Cart"

export default function Header() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  const handleUserClick = () => {
    if (!user) navigate("/login")
    else if (user.role === "ADMIN") navigate("/dashboard/admin")
    else navigate("/dashboard/user")
  }

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <>
      <header className="w-full shadow-md bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Clothing Store
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-black">Home</Link>
            <Link to="/products" className="hover:text-black">Products</Link>
            <Link to="/about" className="hover:text-black">About</Link>
            <Link to="/contact" className="hover:text-black">Contact</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-5 text-gray-700 text-xl">

            {/* Wishlist */}
            <FiHeart className="cursor-pointer hover:text-black" />

            {/* User */}
            <FiUser
              className="cursor-pointer hover:text-black"
              onClick={handleUserClick}
            />

            {/* Cart */}
            <div
              className="relative cursor-pointer hover:text-black"
              onClick={() => setCartOpen(true)}
            >
              <FiShoppingCart />

              {/* CART BADGE */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* CART DRAWER */}
      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  )
}
