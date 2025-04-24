import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyToken,
} from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../middlewares/validators.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verifyToken", verifyToken);

export default router;
