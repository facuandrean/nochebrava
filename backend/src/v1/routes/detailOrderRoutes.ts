import { Router } from "express";
import { validateBody } from "../../middlewares/validateBody";
import { detailOrderController } from "../../controllers/detailOrderController";
import { detailOrderPostSchema } from "../../schemas/detailOrderScheme";

const detailOrderRouter = Router();

detailOrderRouter.get("/", detailOrderController.getDetailOrders);
detailOrderRouter.get("/:order_detail_id", detailOrderController.getDetailOrdersById);
detailOrderRouter.post("/", validateBody(false, detailOrderPostSchema, detailOrderPostSchema), detailOrderController.postDetailOrder);
detailOrderRouter.delete("/:order_detail_id", detailOrderController.deleteDetailOrder);

export default detailOrderRouter;