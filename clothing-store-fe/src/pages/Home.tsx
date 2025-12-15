import { useAuth } from "../context/authContext"

export default function Home() {
  const { user } = useAuth()
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.email}</h1>
        <p className="text-gray-600 mt-2">You're logged in successfully.</p>
    </div>
    )
}
