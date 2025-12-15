import Header from "./Header"
import { Outlet, useLocation } from "react-router-dom"

function Layout() {
  const location = useLocation()
  const authPages = ["/login", "/register"]
  const isAuthPage = authPages.includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main
        className={
          isAuthPage
            ? "flex-1 flex items-center justify-center px-4" // center auth pages
            : "flex-1 container mx-auto p-4" // normal layout
        }
      >
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
