import express from "express";
import {
  getPosts,
  getPost,
  getPostById,
  createPost,
  deletePost,
  updatePost,
  uploadAuth,
  featurePost,
} from "../controllers/post.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";
import { ensureAdmin } from "../middlewares/ensureAdmin.js";

const router = express.Router();

router.get("/upload-auth", ensureAdmin, uploadAuth);

router.get("/", getPosts);
router.get("/id/:id", getPostById);
router.get("/:slug", increaseVisit, getPost);
router.post("/", ensureAdmin, createPost);
router.put("/:id", ensureAdmin, updatePost);
router.delete("/:id", ensureAdmin, deletePost);
router.patch("/feature", ensureAdmin, featurePost);

export default router;
