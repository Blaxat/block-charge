import express from "express";
import {
  registerUser,
  registerStation,
  loginUser,
  loginStation,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register/user", registerUser);
router.post("/register/station", registerStation);
router.post("/login/user", loginUser);
router.post("/login/station", loginStation);
export default router;
