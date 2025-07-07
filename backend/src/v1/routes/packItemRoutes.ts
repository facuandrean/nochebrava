import { Router } from "express";
import { packItemController } from "../../controllers/packItemController";
import { validateBody } from "../../middlewares/validateBody";
import { packItemPostSchema, packItemUpdateSchema } from "../../schemas/packItemSchema";

const packItemRouter = Router();

packItemRouter.get("/", packItemController.getPackItems);
packItemRouter.get("/:pack_item_id", packItemController.getPackItemById);
packItemRouter.post("/", validateBody(false, packItemUpdateSchema, packItemPostSchema), packItemController.postPackItem);
packItemRouter.put("/:pack_item_id", validateBody(true, packItemUpdateSchema, packItemPostSchema), packItemController.putPackItem);
packItemRouter.delete("/:pack_item_id", packItemController.deletePackItem);

export default packItemRouter;