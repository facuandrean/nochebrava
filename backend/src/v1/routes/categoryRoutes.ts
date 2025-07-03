import { Router } from "express";
import { validateBody } from "../../middlewares/validateBody";
import { categoryController } from "../../controllers/categoryController";
import { categoryPostSchema, categoryUpdateSchema } from "../../schemas/categorySchema";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getCategories);
categoryRouter.get("/:category_id", categoryController.getCategoryById);
categoryRouter.post("/", validateBody(false, categoryUpdateSchema, categoryPostSchema), categoryController.postCategory);
categoryRouter.patch("/:category_id", validateBody(true, categoryUpdateSchema, categoryPostSchema), categoryController.patchCategory);
categoryRouter.delete("/:category_id", categoryController.deleteCategory);

export default categoryRouter;