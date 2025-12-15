import { useState, type FormEvent } from "react"
import { getMyDetails, login } from "../services/auth"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"

export default function Login() {
  const navigate = useNavigate()

  const { setUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      alert("All fields are required")
      return
    }

    try {
      const res = await login(email, password)

      if (!res.data.accessToken) {
        alert("Login failed")
        return
      }

      await localStorage.setItem("accessToken", res.data.accessToken)
      await localStorage.setItem("refreshToken", res.data.refreshToken)

      const detail = await getMyDetails()
      console.log(detail)

      if (!detail.data.isActive) {
        alert("Your account is disabled. Contact admin.")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        return
      }

      setUser(detail.data)
      navigate("/")
    } catch (err) {
      console.error(err)
      alert("Login failed. Please check your credentials.")
    }
  }

  return (
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>

        <div className="flex flex-col gap-4">
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition"
            >
            Login
            </button>
        </div>

        <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    )
}
