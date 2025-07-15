import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "../controllers/category.controller.js";

const router = Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.post("/:id/delete", deleteCategory);

export default router;
