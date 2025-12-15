import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function AdminLayout() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Shared Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between p-6">
          <div>
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

            <nav className="flex flex-col space-y-3">
              <a href="/dashboard/admin" className="hover:bg-gray-800 px-4 py-2 rounded">
                Dashboard
              </a>
              <a href="/dashboard/admin/users" className="hover:bg-gray-800 px-4 py-2 rounded">
                Manage Users
              </a>
              <a href="/dashboard/admin/products" className="hover:bg-gray-800 px-4 py-2 rounded">
                Manage Products
              </a>
              <a href="/dashboard/admin/orders" className="hover:bg-gray-800 px-4 py-2 rounded">
                Orders
              </a>
            </nav>
          </div>

          {/* Logout button at bottom */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
