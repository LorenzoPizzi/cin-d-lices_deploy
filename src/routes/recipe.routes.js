import { Router } from "express";
import recipeController from "../controllers/recipe.controller.js";
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

router.get("/", recipeController.showAllRecipes);

router.get("/add", /* authenticate*/ recipeController.showAddRecipeForm);

router.get("/:id", recipeController.showRecipeDetail);

router.post(
    "/add",
    /* authenticate,*/ upload.single("image"),
    recipeController.addRecipe
);

router.get("/:id/edit", /* authenticate,*/ recipeController.showEditRecipeForm);

router.post(
    "/:id/edit",
    /*authenticate,*/ upload.single("image"),
    recipeController.editRecipe
);

router.post("/:id/delete", /*authenticate,*/ recipeController.deleteRecipe);

export default router;
