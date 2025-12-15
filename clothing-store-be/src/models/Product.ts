import mongoose, { Schema, Document } from "mongoose";

export enum Gender {
    MEN = "MEN",
    WOMEN = "WOMEN",
    UNISEX = "UNISEX"
}

export enum Category {
    TSHIRT = "TSHIRT",
    SHIRT = "SHIRT",
    SHORT = "SHORT",
    DENIM = "DENIM",
    OFFICEWEAR = "OFFICEWEAR"
}

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId,
    title: string,
    description?: string,
    gender: Gender,
    category: Category,
    size: string,
    price: number,
    stock: number,
    imageUrls: string[],
    createdAt: Date
}

const productSchema: Schema = new Schema<IProduct>({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: Object.values(Category), required: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imageUrls: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Product = mongoose.model<IProduct>("Product", productSchema);