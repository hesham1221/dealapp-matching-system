import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { handleError } from "../middleware/errorHandler.js";
import { validateRequest } from "../services/validation.js";
import { registerSchema, loginSchema } from "../validators/authValidators.js";

export const register = async (req, res) => {
  try {
    const { name, phone, password, role } = validateRequest(
      registerSchema,
      req.body
    );

    const existingUser = await User.findOne({ phone, status: "ACTIVE" });

    if (existingUser) {
      return handleError(res, 400, "User Aleady Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      phone,
      password: hashedPassword,
      role,
      status: "ACTIVE", // Assume that this the bussiness logic and will be changed to handle the status by verification code or by admin
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    attachUserWithTokenToRes(res.status(201), user, token);
  } catch (error) {
    handleError(res, 400, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = validateRequest(loginSchema, req.body);

    const user = await User.findOne({ phone });
    if (!user) {
      return handleError(res, 400, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handleError(res, 400, "Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    attachUserWithTokenToRes(res, user, token);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

function attachUserWithTokenToRes(res, user, token) {
  const response = { ...user.toJSON(), token };
  delete response.password;
  return res.json(response);
}
