import { Router } from "express";
import { validateBody } from "../../middlewares/validateBody";
import { ordersController } from "../../controllers/orderController";
import { orderPostSchema } from "../../schemas/orderSchema";

const orderRouter = Router();

orderRouter.get("/", ordersController.getOrders);
orderRouter.get("/:order_id", ordersController.getOrderById);
orderRouter.get("/:order_id/with-details", ordersController.getOrderWithDetails);
orderRouter.post("/", validateBody(false, orderPostSchema, orderPostSchema), ordersController.postOrder);
orderRouter.delete("/:order_id", ordersController.deleteOrder);

export default orderRouter;