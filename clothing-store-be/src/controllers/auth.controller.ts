import { Request, Response } from "express"
import { IUser, Role, User } from "../models/User"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from "../utils/tokens"
import { AuthRequest } from "../middleware/auth"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const register = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, role } = req.body

    // data validation
    if (!firstname || !lastname || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (role !== Role.USER) {
      return res.status(400).json({ message: "Invalid role" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email alrady registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      firstname, // firstname: firstname
      lastname,
      email,
      password: hashedPassword,
      role: role
    })

    await newUser.save()

    res.status(201).json({
      message: "User registered successfully",
      data: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    })
  } catch (err: any) {
    res.status(500).json({ message: err?.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, existingUser.password)
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const accessToken = signAccessToken(existingUser)
    const refreshToken = signRefreshToken(existingUser) // this

    res.status(200).json({
      message: "success",
      data: {
        email: existingUser.email,
        role: existingUser.role,
        accessToken,
        refreshToken // this
      }
    })
  } catch (err: any) {
    res.status(500).json({ message: err?.message })
  }
}

export const getMyDetails = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const userId = req.user.sub
  const user =
    ((await User.findById(userId).select("-password")) as IUser) || null

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    })
  }

  const { firstname, lastname, email, role, isActive } = user

  res.status(200).json({
    message: "Ok",
    data: { firstname, lastname, email, role, isActive }
  })
}

export const registerAdmin = async (req: Request, res: Response) => {
    try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required..!"
      })
    }

    const exUser = await User.findOne({ email })
    if (exUser) {
      return res.status(400).json({
        message: "Admin with this email alrady exists..!"
      })
    }

    const role = Role.ADMIN

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role
    })

    await newAdmin.save()

    res.status(201).json({
      message: "Admin registered succesfully",
      data: {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role
      }
    })
  } catch (error) {
    console.error("Error occurred during registration:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ message: "Token required" })
    }
    // import jwt from "jsonwebtoken"
    const payload = jwt.verify(token, JWT_REFRESH_SECRET)
    // payload.sub - userID
    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }
    const accessToken = signAccessToken(user)
    res.status(200).json({ accessToken })
  } catch (err) {
    res.status(403).json({ message: "Invalid or expire token" })
  }
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      data: users
    });
  } catch (err: any) {
    res.status(500).json({ message: err?.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      data: user
    });
  } catch (err: any) {
    res.status(500).json({ message: err?.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.id;
    const { firstname, lastname, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstname, lastname, email, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (err: any) {
    res.status(500).json({ message: err?.message });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle isActive
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: user.isActive ? "User enabled successfully" : "User disabled successfully",
      data: user
    });
  } catch (err: any) {
    res.status(500).json({ message: err?.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (err: any) {
    res.status(500).json({ message: err?.message });
  }
};
