import { productController } from "../../controllers/productController";

import { Router } from "express";

const productRouter = Router();

productRouter.get("/", productController.getProducts);
productRouter.get("/:id_product", productController.getProductById);
productRouter.post("/", productController.postProduct);
productRouter.patch("/:id_product", productController.patchProduct);
productRouter.delete("/:id_product", productController.deleteProduct);

export default productRouter;