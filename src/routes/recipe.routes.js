import { Router } from "express";
import {
    addRecipe,
    deleteRecipe,
    editRecipe,
    showAddRecipeForm,
    showAllRecipes,
    showEditRecipeForm,
    showRecipeDetail,
} from "../controllers/recipe.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

const upload = multer({ storage });

const router = Router();

router.get("/", showAllRecipes);

router.get("/add", authenticate, showAddRecipeForm);

router.get("/:id", showRecipeDetail);

router.post("/add", authenticate, upload.single("image"), addRecipe);

router.get("/:id/edit", authenticate, showEditRecipeForm);

router.post("/:id/edit", authenticate, upload.single("image"), editRecipe);

router.post("/:id/delete", authenticate, deleteRecipe);

export default router;
