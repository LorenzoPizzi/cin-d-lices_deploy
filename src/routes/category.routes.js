import { Router } from "express";
import categoryController from "../controllers/category.controller.js";

const router = Router();

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.post("/:id/delete", categoryController.deleteCategory);

export default router;
