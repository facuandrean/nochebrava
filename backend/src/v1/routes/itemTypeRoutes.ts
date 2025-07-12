import { Router } from "express";
import { itemTypeController } from "../../controllers/ItemTypeController";
import { validateBody } from "../../middlewares/validateBody";
import { itemTypeSchema } from "../../schemas/itemTypeSchema";

const itemTypeRouter = Router();

itemTypeRouter.get("/", itemTypeController.getAllItemTypes);
itemTypeRouter.get("/:item_type_id", itemTypeController.getItemTypeById);
itemTypeRouter.post("/", validateBody(false, itemTypeSchema, itemTypeSchema), itemTypeController.postItemType);
itemTypeRouter.put("/:item_type_id", validateBody(true, itemTypeSchema, itemTypeSchema), itemTypeController.updateItemType);
itemTypeRouter.delete("/:item_type_id", itemTypeController.deleteItemType);

export default itemTypeRouter;