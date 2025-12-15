import api from "./api"

interface OrderPayload {
  items: {
    productId: string
    quantity: number
  }[]
}

export const createOrder = async (orderPayload: OrderPayload) => {
  return api.post("/orders/create", orderPayload)
}
