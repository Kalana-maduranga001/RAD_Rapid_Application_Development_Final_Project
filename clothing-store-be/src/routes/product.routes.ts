import { Router } from "express"
import { deleteProduct, getAllProducts, saveProduct, updateProduct } from "../controllers/product.controller"
import { authenticate, isAdmin } from "../middleware/auth"
import { upload } from "../middleware/upload"

const router = Router()

router.post(
  "/create",
  authenticate,
  isAdmin,
  upload.array("images", 5),
  saveProduct
)

router.get("/", getAllProducts)
router.put("/:id", authenticate, isAdmin, upload.array("images"), updateProduct);
router.delete("/:id", authenticate, isAdmin, deleteProduct);

export default router