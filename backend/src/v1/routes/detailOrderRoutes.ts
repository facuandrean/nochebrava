import { Router } from "express";
import { validateBody } from "../../middlewares/validateBody";
import { detailOrderController } from "../../controllers/detailOrderController";
import { detailOrderPostSchema } from "../../schemas/detailOrderSchema";

const detailOrderRouter = Router();

detailOrderRouter.get("/", detailOrderController.getDetailOrders);
detailOrderRouter.get("/order/:order_id", detailOrderController.getDetailOrdersByOrderId);
detailOrderRouter.get("/:order_detail_id", detailOrderController.getDetailOrdersById);
detailOrderRouter.get("/:order_detail_id/with-item-info", detailOrderController.getDetailOrderWithItemInfo);
detailOrderRouter.post("/", validateBody(false, detailOrderPostSchema, detailOrderPostSchema), detailOrderController.postDetailOrder);
detailOrderRouter.delete("/:order_detail_id", detailOrderController.deleteDetailOrder);

export default detailOrderRouter;