import express from "express";
import multer from "multer";
import path from "path";
import {
  registerUser,
  getAllUsers,
  loginUser,
  getUserById,
  updateProfilePicture
} from "../controllers/userController";

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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.post(
  "/update-profile-picture",
  upload.single("profile"),
  updateProfilePicture
);

export default router;
