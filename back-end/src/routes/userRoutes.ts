// userroutes.ts

import express from "express";
import multer from "multer";
import path from "path";
import {
  registerUser,
  getAllUsers,
  loginUser,
  getUserById,
  updateProfilePicture,
  deleteProfilePicture,
  updateEmailOrPassword
} from "../controllers/userController";
import { sendTempPassword } from "../controllers/userController";



const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Rotas existentes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-temp-password", sendTempPassword);
router.delete("/profile-picture", deleteProfilePicture);


router.post(
  "/update-profile-picture",
  upload.single("profile"),
  updateProfilePicture
);


router.put("/update-email-password", updateEmailOrPassword);
router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
