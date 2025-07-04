import { Router } from "express";
import { productCategoryController } from "../../controllers/productCategoryController";
import { validateBody } from "../../middlewares/validateBody";
import { productCategoryPostSchema, productCategoryUpdateSchema } from "../../schemas/productCategorySchema";

const productCategoryRouter = Router();

productCategoryRouter.get("/products/category/:category_id", productCategoryController.getProductsByCategory);
productCategoryRouter.get("/categories/product/:product_id", productCategoryController.getCategoriesByProduct);
productCategoryRouter.post("/", validateBody(false, productCategoryUpdateSchema, productCategoryPostSchema), productCategoryController.assignCategoryToProduct);
productCategoryRouter.patch("/product/:product_id_old/category/:category_id_old", validateBody(true, productCategoryUpdateSchema, productCategoryPostSchema), productCategoryController.updateProductCategory);
productCategoryRouter.delete("/product/:product_id/category/:category_id", productCategoryController.unassignCategoryFromProduct);

export default productCategoryRouter;