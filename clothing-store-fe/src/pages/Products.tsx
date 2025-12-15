import { useEffect, useState } from "react"
import { getProducts, GENDERS, CATEGORIES } from "../services/product"
import type { ProductType, Gender, Category } from "../services/product"
import { useCart } from "../context/cartContext"

export default function Products() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  // Modal
  const [selectedProduct, setSelectedProduct] =
    useState<ProductType | null>(null)

  // Filters
  const [search, setSearch] = useState("")
  const [gender, setGender] = useState<Gender | "ALL">("ALL")
  const [category, setCategory] = useState<Category | "ALL">("ALL")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState("default")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Modal helpers
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const { addToCart } = useCart()

  useEffect(() => {
    loadProducts()
  }, [search, gender, category, minPrice, maxPrice, sortBy])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts(1, 200)
      let data: ProductType[] = res.data

      if (search.trim()) {
        data = data.filter((p) =>
          p.title.toLowerCase().includes(search.toLowerCase())
        )
      }

      if (category !== "ALL") {
        data = data.filter((p) => p.category === category)
      }

      if (gender !== "ALL") {
        data = data.filter((p) => p.gender === gender)
      }

      if (minPrice) data = data.filter(p => p.price >= Number(minPrice))
      if (maxPrice) data = data.filter(p => p.price <= Number(maxPrice))

      if (sortBy === "price_low") data.sort((a, b) => a.price - b.price)
      if (sortBy === "price_high") data.sort((a, b) => b.price - a.price)
      if (sortBy === "name_asc") data.sort((a, b) => a.title.localeCompare(b.title))
      if (sortBy === "name_desc") data.sort((a, b) => b.title.localeCompare(a.title))

      setProducts(data)
      setCurrentPage(1)
    } catch (err) {
      console.error("Failed to load products", err)
    } finally {
      setLoading(false)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(products.length / itemsPerPage)

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(0)
      setQuantity(1)
    }
  }, [selectedProduct])

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center mb-8">
        <input
          className="border px-4 py-2 rounded w-full sm:w-64"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "ALL")}
        >
          <option value="ALL">ALL</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender | "ALL")}
        >
          <option value="ALL">ALL</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          className="border px-3 py-1 rounded w-28"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          className="border px-3 py-1 rounded w-28"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="border px-3 py-1 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="price_low">Price: Low → High</option>
          <option value="price_high">Price: High → Low</option>
          <option value="name_asc">Name: A → Z</option>
          <option value="name_desc">Name: Z → A</option>
        </select>
      </div>

      {/* GRID */}
      {loading ? (
        <p>Loading...</p>
      ) : currentItems.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentItems.map((p) => (
            <div
              key={p._id}
              onClick={() => setSelectedProduct(p)}
              className="bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02]"
            >
              <img
                src={p.imageUrls[0]}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold">{p.title}</h2>
                <p className="text-sm text-gray-600">{p.category}</p>
                <p className="font-bold mt-1">Rs. {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-4xl w-full mx-4 p-6 relative"
          >
            <button
              className="absolute top-3 right-3 text-xl"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedProduct.imageUrls[activeImage]}
                  className="w-full h-96 object-cover rounded mb-4"
                />
                <div className="flex gap-2">
                  {selectedProduct.imageUrls.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setActiveImage(i)}
                      className={`h-20 w-20 object-cover border rounded cursor-pointer ${
                        activeImage === i ? "border-black" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-bold">{selectedProduct.title}</h2>
                <p className="text-gray-600">{selectedProduct.category}</p>
                <p className="text-2xl font-bold text-green-700">
                  Rs. {selectedProduct.price}
                </p>
                <p>{selectedProduct.description}</p>
                <p><strong>Size:</strong> {selectedProduct.size}</p>

                <button
                  onClick={() => {
                    addToCart(selectedProduct, quantity)
                    setSelectedProduct(null)
                  }}
                  className="mt-4 bg-black text-white py-3 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
