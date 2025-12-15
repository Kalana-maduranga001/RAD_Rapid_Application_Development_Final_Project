import { useEffect, useState } from "react"
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type ProductType,
  type Gender,
  type Category,
} from "../services/product"

const CATEGORIES: Category[] = [
  "TSHIRT",
  "SHIRT",
  "SHORT",
  "DENIM",
  "OFFICEWEAR",
]

const GENDERS: Gender[] = ["MEN", "WOMEN", "UNISEX"]

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "" as Category | "",
    gender: "" as Gender | "",
    size: "",
    price: "",
    stock: "",
  })

  const [images, setImages] = useState<FileList | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts(page, 10)
      setProducts(res.data)
      setTotalPages(res.totalPages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page])

  const buildFormData = () => {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (images) Array.from(images).forEach((img) => fd.append("images", img))
    return fd
  }

  const handleCreate = async () => {
    if (!images || !form.gender || !form.category) {
      alert("Gender, Category and at least 1 image are required")
      return
    }

    await createProduct(buildFormData())
    setShowAddModal(false)
    setForm({
      title: "",
      description: "",
      category: "",
      gender: "",
      size: "",
      price: "",
      stock: "",
    })
    setImages(null)
    fetchProducts()
  }

  const handleOpenEdit = (p: ProductType) => {
    setEditingProductId(p._id)
    setForm({
      title: p.title,
      description: p.description || "",
      category: p.category,
      gender: p.gender,
      size: p.size,
      price: String(p.price),
      stock: String(p.stock),
    })
    setImages(null)
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (!editingProductId) return
    await updateProduct(editingProductId, buildFormData())
    setShowEditModal(false)
    setEditingProductId(null)
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    await deleteProduct(id)
    fetchProducts()
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border rounded p-4">
              <img
                src={p.imageUrls[0]}
                className="h-40 w-full object-cover rounded"
              />
              <h2 className="font-semibold mt-2">{p.title}</h2>
              <p className="text-sm">{p.category} · {p.gender}</p>
              <p className="font-bold">Rs. {p.price}</p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODALS USE SAME FORM */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 space-y-3">
            <input
              className="border p-2 w-full"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className="border p-2 w-full"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <select
              className="border p-2 w-full"
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value as Gender })
              }
            >
              <option value="">Select Gender</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              className="border p-2 w-full"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as Category })
              }
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              className="border p-2 w-full"
              placeholder="Size"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
            />

            <input
              className="border p-2 w-full"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input
              className="border p-2 w-full"
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />

            <input
              type="file"
              multiple
              className="border p-2 w-full"
              onChange={(e) => setImages(e.target.files)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setShowEditModal(false)
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={showEditModal ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-black text-white rounded"
              >
                {showEditModal ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
