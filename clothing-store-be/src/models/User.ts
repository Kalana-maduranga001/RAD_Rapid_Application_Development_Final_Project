import mongoose, { Document, Schema } from "mongoose"

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  firstname: string
  lastname: string
  email: string
  password: string
  role: Role,
  createdAt: Date
  isActive: boolean
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.USER },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
})

export const User = mongoose.model<IUser>("User", userSchema)
