import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { RegisterInput, LoginInput } from "./auth.schema";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export class AuthService {
  // Register a new customer
  static async register(data: RegisterInput) {
    // Check if email exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new Error("Email already registered");
    }

    // Find CUSTOMER role
    const customerRole = await prisma.role.findUnique({
      where: { name: "CUSTOMER" },
    });
    if (!customerRole) {
      throw new Error("Role configuration error");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        phone: data.phone,
        roleId: customerRole.id,
        emailVerified: false,
      },
      include: { role: true },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role.name,
    };
  }

  // Login user
  static async login(data: LoginInput) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { role: true },
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if active
    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    // Verify password
    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions,
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
      },
    };
  }
}
