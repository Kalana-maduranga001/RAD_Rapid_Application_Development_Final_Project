import { Router } from "express"
import {
  deleteUser,
  getAllUsers,
  getMyDetails,
  getUserById,
  handleRefreshToken,
  login,
  register,
  registerAdmin,
  toggleUserStatus,
  updateUser
} from "../controllers/auth.controller"
import { authenticate, isAdmin } from "../middleware/auth"

const router = Router()

router.post("/register", register)
router.post("/login", login)

// api/v1/auth/refresh (public)
router.post("/refresh", handleRefreshToken)

// protected (USER, ADMIN)
router.get("/me", authenticate, getMyDetails)

// protected
// ADMIN only
// need create middleware for check req is from ADMIN

router.post("/admin/register", authenticate, isAdmin, registerAdmin)
router.get("/admin/users", authenticate, isAdmin, getAllUsers);
router.get("/admin/users/:id", authenticate, isAdmin, getUserById);
router.put("/admin/users/:id", authenticate, isAdmin, updateUser);
router.patch("/admin/users/:id/toggle", authenticate, isAdmin, toggleUserStatus);
router.delete("/admin/users/:id", authenticate, isAdmin, deleteUser);

export default router
