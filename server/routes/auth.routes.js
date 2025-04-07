import { Router } from "express";
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
  verifyEmail,
} from "../controllers/auth.controller.js";
import passport from "passport";

import jwt from "jsonwebtoken";
import { GOOGLE_CLIENT_ID, JWT_SECRET, NODE_ENV } from "../config/env.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/refresh-token", refreshToken);

// Route bắt đầu quá trình xác thực với Google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route callback sau khi Google xác thực thành công
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      // Tạo JWT token
      const token = jwt.sign({ userId: req.user._id }, JWT_SECRET, {
        expiresIn: "1d",
      });

      // Lưu token vào cookie (hoặc trả về trong response)
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Google Authentication successful",
        token,
        user: req.user,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);
export default authRouter;
