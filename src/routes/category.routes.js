import { Router } from "express";
import {
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "../controllers/category.controller.js";

const router = Router();

router.get("/", getAllCategories);
router.put("/:id", updateCategory);
router.post("/:id/delete", deleteCategory);

export default router;
