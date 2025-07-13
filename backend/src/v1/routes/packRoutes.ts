import { Router } from "express";
import { packController } from "../../controllers/packController";
import { packItemController } from "../../controllers/packItemController";
import { validateBody } from "../../middlewares/validateBody";
import { packPostSchema, packUpdateSchema } from "../../schemas/packSchema";
import { packItemPostSchema, packItemUpdateSchema } from "../../schemas/packItemSchema";

const packRouter = Router();

packRouter.get("/", packController.getPacks);
packRouter.get("/:pack_id", packController.getPackById);
packRouter.post("/", validateBody(false, packUpdateSchema, packPostSchema), packController.postPack);
packRouter.patch("/:pack_id", validateBody(true, packUpdateSchema, packPostSchema), packController.updatePack);
packRouter.delete("/:pack_id", packController.deletePack);

packRouter.get("/:pack_id/items", packItemController.getPackItemsByPackId);
packRouter.post("/:pack_id/items", validateBody(false, packItemUpdateSchema, packItemPostSchema), packItemController.postPackItem);

export default packRouter;