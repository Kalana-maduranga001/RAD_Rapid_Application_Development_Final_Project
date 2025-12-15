import api from "./api"

export type Gender = "MEN" | "WOMEN" | "UNISEX"
export type Category =
  | "TSHIRT"
  | "SHIRT"
  | "SHORT"
  | "DENIM"
  | "OFFICEWEAR"

export const GENDERS: Gender[] = ["MEN", "WOMEN", "UNISEX"]

export const CATEGORIES: Category[] = [
  "TSHIRT",
  "SHIRT",
  "SHORT",
  "DENIM",
  "OFFICEWEAR",
]

export type ProductType = {
  _id: string
  title: string
  description?: string
  gender: Gender
  category: Category
  size: string
  price: number
  stock: number
  imageUrls: string[]
  createdAt: string
}

/** backend response shape */
export type ProductResponse = {
  data: ProductType[]
  totalPages: number
  totalCount: number
  page: number
}

export const createProduct = async (data: FormData) => {
  const res = await api.post("/product/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const getProducts = async (
  page = 1,
  limit = 10
): Promise<ProductResponse> => {
  const res = await api.get(`/product?page=${page}&limit=${limit}`)
  return res.data
}

export const updateProduct = async (id: string, data: FormData) => {
  const res = await api.put(`/product/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/product/${id}`)
  return res.data
}
