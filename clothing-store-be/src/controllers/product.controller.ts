import { Request, Response } from "express"
import cloudinary from "../config/cloudinary"
import { Product, Gender, Category } from "../models/Product"
import { AuthRequest } from "../middleware/auth"

export const saveProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" })
    }

    const {
      title,
      description,
      gender,
      category,
      fragrance,
      size,
      price,
      stock
    } = req.body

    // 🔐 Required field validation
    if (!title || !gender || !category || !size || !price) {
      return res.status(400).json({
        message: "Missing required fields"
      })
    }

    // 🔐 Enum validation
    if (!Object.values(Gender).includes(gender)) {
      return res.status(400).json({ message: "Invalid gender value" })
    }

    if (!Object.values(Category).includes(category)) {
      return res.status(400).json({ message: "Invalid category value" })
    }

    const files = req.files as Express.Multer.File[]

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" })
    }

    const imageUrls: string[] = []

    for (const file of files) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "bovita-candles" },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        stream.end(file.buffer)
      })

      imageUrls.push(result.secure_url)
    }

    const newProduct = await Product.create({
      title,
      description,
      gender,
      category,
      fragrance,
      size,
      price,
      stock: stock ?? 0,
      imageUrls
    })

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" })
    }

    const productId = req.params.id

    const {
      title,
      description,
      gender,
      category,
      fragrance,
      size,
      price,
      stock
    } = req.body

    if (gender && !Object.values(Gender).includes(gender)) {
      return res.status(400).json({ message: "Invalid gender value" })
    }

    if (category && !Object.values(Category).includes(category)) {
      return res.status(400).json({ message: "Invalid category value" })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    let imageUrls = product.imageUrls
    const files = req.files as Express.Multer.File[]

    if (files && files.length > 0) {
      imageUrls = []

      for (const file of files) {
        const result: any = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "bovita-candles" },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          stream.end(file.buffer)
        })

        imageUrls.push(result.secure_url)
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        gender,
        category,
        fragrance,
        size,
        price,
        stock,
        imageUrls
      },
      { new: true, runValidators: true }
    )

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { gender, category } = req.query

    const filter: any = {}

    if (gender) filter.gender = gender
    if (category) filter.category = category

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Product.countDocuments(filter)

    res.status(200).json({
      data: products,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch products" })
  }
}

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from Cloudinary
    for (const imageUrl of product.imageUrls) {
      const publicId = imageUrl.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`bovita-candles/${publicId}`);
      }
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({ message: "Product deleted" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
