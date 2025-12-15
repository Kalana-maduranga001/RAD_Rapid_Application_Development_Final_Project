import { useState, type FormEvent } from "react"
import { register } from "../services/auth"
import { useNavigate } from "react-router-dom"

export default function Register() {
  // state - component data
  // useState is react hook, for manage state
  const navigate = useNavigate()

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")

  const handleRgister = async (e: FormEvent) => {
    e.preventDefault() // ignore page refresh

    if (!firstname || !lastname || !email || !password || !conPassword) {
      // find alert libraries
      alert("All fields are required.")
      return
    }

    if (password !== conPassword) {
      alert("Password do not match.")
      return
    }

    try {
      const obj = {
        firstname,
        lastname,
        email,
        password,
        role: "USER"
      }
      const res: any = await register(obj)
      console.log(res.data)
      console.log(res.message)

      alert(`Reginstration successful! Email: ${res?.data?.email}`)
      //  const navigate = useNavigate()
      navigate("/login")

      // const response = await axios.post(
      //   "http://localhost:5000/api/v1/auth/register",
      //   {
      //     firstname, //firstname: firstname
      //     lastname,
      //     email,
      //     password,
      //     role
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json"
      //     }
      //   }
      // )
      // console.log(response)
    } catch (err: any) {
      console.error(err?.response?.data)
    }
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create an Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="col-span-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
            type="password"
            placeholder="Confirm Password"
            value={conPassword}
            onChange={(e) => setConPassword(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <button
            onClick={handleRgister}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold transition"
        >
            Register
        </button>

        <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
    </div>
    )
}
