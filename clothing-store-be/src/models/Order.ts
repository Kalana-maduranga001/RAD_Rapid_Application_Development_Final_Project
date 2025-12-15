import mongoose, { Schema, Document } from "mongoose";

interface IOrderProduct {
    product: mongoose.Types.ObjectId;
    title: string;
    quantity: number;
    price: number;
}

export enum Status {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    SHIPPED = "SHIPPED",
    CANCELLED = "CANCELLED"
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    products: IOrderProduct[];
    totalAmount: number;
    status: Status;
    createdAt: Date;
}

const orderProductSchema = new Schema<IOrderProduct>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
})

const orderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [orderProductSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: Object.values(Status), default: Status.PENDING },
    createdAt: { type: Date, default: Date.now }
})

export const Order = mongoose.model<IOrder>("Order", orderSchema);