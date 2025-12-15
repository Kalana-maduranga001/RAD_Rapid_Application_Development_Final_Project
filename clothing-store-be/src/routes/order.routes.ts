import { Router } from "express"
import { saveOrder } from "../controllers/order.controller"
import { authenticate, isAdmin } from "../middleware/auth"

const router = Router()

router.post(
  "/create",
  authenticate,
  isAdmin,
  saveOrder
)

export default router