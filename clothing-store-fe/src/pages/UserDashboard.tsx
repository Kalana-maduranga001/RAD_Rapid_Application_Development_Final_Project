import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"

export default function UserDashboard() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    navigate("/login")
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">User Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome to your dashboard!</p>
      
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  )
}
