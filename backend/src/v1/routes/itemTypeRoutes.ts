import { Router } from "express";
import { itemTypeController } from "../../controllers/ItemTypeController";

const itemTypeRouter = Router();

itemTypeRouter.get("/", itemTypeController.getAllItemTypes);
itemTypeRouter.get("/:item_type_id", itemTypeController.getItemTypeById);
itemTypeRouter.post("/", itemTypeController.postItemType);
itemTypeRouter.put("/:item_type_id", itemTypeController.updateItemType);
itemTypeRouter.delete("/:item_type_id", itemTypeController.deleteItemType);

export default itemTypeRouter;