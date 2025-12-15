import { Request, Response } from "express"
import { Order } from "../models/Order"
import { AuthRequest } from "../middleware/auth"
import { Product } from "../models/Product";

export const saveOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.sub
    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order items" })
    }

    let total = 0
    const itemsDetailed = []

    for (const it of items) {
      if (it.quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" })
      }

      const p = await Product.findById(it.productId)
      if (!p) {
        return res.status(400).json({ message: `Product not found: ${it.productId}` })
      }

      itemsDetailed.push({
        product: p._id,
        title: p.title,
        quantity: it.quantity,
        price: p.price
      })

      total += p.price * it.quantity
    }

    const order = new Order({
      user: userId,
      products: itemsDetailed,
      totalAmount: total,
      status: "PENDING"
    })

    const savedOrder = await order.save()

    res.status(201).json(savedOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}