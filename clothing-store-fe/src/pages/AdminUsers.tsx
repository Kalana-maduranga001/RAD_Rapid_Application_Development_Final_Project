import { useEffect, useState } from "react"
import type { UserType } from "../services/admin"
import {
  getAllUsers,
  toggleUserStatus as toggleUserStatusApi,
  deleteUser as deleteUserApi,
  updateUser as updateUserApi,
  createAdmin, // ⭐ NEW
} from "../services/admin"

export default function AdminUsers() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)

  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState<Partial<UserType>>({})

  // ⭐ NEW → Add Admin Modal State
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  })

  // Load Users
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      console.error(err)
      alert("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleUserStatus = async (id: string) => {
    await toggleUserStatusApi(id)
    fetchUsers()
  }

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return
    await deleteUserApi(id)
    fetchUsers()
  }

  const handleEdit = (user: UserType) => {
    setEditingUser(user)
    setFormData(user)
  }

  const handleUpdate = async () => {
    if (!editingUser) return
    await updateUserApi(editingUser._id, formData)
    setEditingUser(null)
    fetchUsers()
  }

  // ⭐ NEW → Handle Add Admin
  const handleAddAdmin = async () => {
    const { firstname, lastname, email, password } = newAdmin

    if (!firstname || !lastname || !email || !password) {
      alert("All fields are required")
      return
    }

    try {
      await createAdmin({
        firstname,
        lastname,
        email,
        password,
        role: "ADMIN",
      })

      setShowAddAdmin(false)
      setNewAdmin({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      })

      fetchUsers()
    } catch (err) {
      console.error(err)
      alert("Failed to create admin")
    }
  }

  if (loading) return <p>Loading users...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>

        {/* ⭐ NEW — Add Admin Button */}
        <button
          onClick={() => setShowAddAdmin(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Admin
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="p-3">{user.firstname} {user.lastname}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>

                <td className="p-3">
                  {user.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Disabled</span>
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleUserStatus(user._id)}
                    className={`px-3 py-1 rounded text-white ${
                      user.isActive ? "bg-yellow-500" : "bg-green-600"
                    }`}
                  >
                    {user.isActive ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ------------------------ */}
      {/* ⭐ NEW — ADD ADMIN MODAL */}
      {/* ------------------------ */}

      {showAddAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 w-96 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Admin</h2>

            <input
              type="text"
              placeholder="First Name"
              value={newAdmin.firstname}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, firstname: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={newAdmin.lastname}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, lastname: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddAdmin(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleAddAdmin}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Edit Modal stays unchanged */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>

            <input
              type="text"
              placeholder="First Name"
              className="w-full mb-3 p-2 border rounded"
              value={formData.firstname || ""}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Last Name"
              className="w-full mb-3 p-2 border rounded"
              value={formData.lastname || ""}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <select
              className="w-full mb-3 p-2 border rounded"
              value={formData.role || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "USER" | "ADMIN",
                })
              }
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
