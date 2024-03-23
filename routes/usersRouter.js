import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import * as usersController from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSchema, verifySchema, subscriptionSchema } from "../schemas/usersShemas.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", validateBody(userSchema), usersController.register);
router.post("/login", validateBody(userSchema), usersController.login);
router.post("/logout", authMiddleware, usersController.logout);
router.get("/current", authMiddleware, usersController.getCurrentUser);
router.patch("/", authMiddleware, validateBody(subscriptionSchema), usersController.updateSubscription);
router.get("/avatar", authMiddleware, usersController.getAvatar);
router.patch("/avatar", authMiddleware, upload.single("avatar"), usersController.uploadAvatar);
router.get("/verify/:token", usersController.verify);
router.post("/verify", validateBody(verifySchema), usersController.verifyRequest);

// /api/users/verify/:token
export default router;