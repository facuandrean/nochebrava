import { productController } from "../../controllers/productController";

import { Router } from "express";
import { validateBody } from "../../middlewares/validateBody";
import { productPostSchema, productUpdateSchema } from "../../schemas/productSchema";

const productRouter = Router();

productRouter.get("/", productController.getProducts);
productRouter.get("/:id_product", productController.getProductById);
productRouter.post("/", validateBody(false, productUpdateSchema, productPostSchema), productController.postProduct);
productRouter.patch("/:id_product", validateBody(true, productUpdateSchema, productPostSchema), productController.patchProduct);
productRouter.delete("/:id_product", productController.deleteProduct);

export default productRouter;