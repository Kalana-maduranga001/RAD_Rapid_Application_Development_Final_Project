import { lazy, Suspense, type ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../context/authContext"
import Layout from "../components/Layout"
import AdminLayout from "../components/AdminLayout"

const Home = lazy(() => import("../pages/Home"))
const Products = lazy(() => import("../pages/Products"))
const About = lazy(() => import("../pages/about"))
const Contact = lazy(() => import("../pages/Contact"))
const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))
const UserDashboard = lazy(() => import("../pages/UserDashboard"))
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"))
const AdminUsers = lazy(() => import("../pages/AdminUsers"))
const AdminProducts = lazy(() => import("../pages/AdminProducts"))
const Checkout = lazy(() => import("../pages/Checkout"))

// const Post = lazy(() => import("../pages/Post"))
// const MyPost = lazy(() => import("../pages/MyPost"))

type RequireAuthTypes = { children: ReactNode; roles?: string[] }

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Access denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }

  return <>{children}</>
}

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* User Dashboard */}
            <Route
              path="/dashboard/user"
              element={
                <RequireAuth roles={["USER"]}>
                  <UserDashboard />
                </RequireAuth>
              }
            />

            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Admin dashboard uses a separate layout with sidebar */}
          <Route
            path="/dashboard/admin"
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>
          <Route path="/checkout" element={
            <RequireAuth roles={["USER", "ADMIN"]}>
              <Checkout />
            </RequireAuth>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
