import { AuthProvider } from "./context/authContext"
import { CartProvider } from "./context/cartContext"
import Router from "./routes"

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router />
      </CartProvider>
    </AuthProvider>
  )
}
