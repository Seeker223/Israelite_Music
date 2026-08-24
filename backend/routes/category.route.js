import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { ensureAdmin } from "../middlewares/ensureAdmin.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", ensureAdmin, createCategory);
router.put("/:id", ensureAdmin, updateCategory);
router.delete("/:id", ensureAdmin, deleteCategory);

export default router;

