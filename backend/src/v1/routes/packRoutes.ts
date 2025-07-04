import { Router } from "express";
import { packController } from "../../controllers/packController";
import { validateBody } from "../../middlewares/validateBody";
import { packPostSchema, packUpdateSchema } from "../../schemas/packSchema";

const packRouter = Router();

packRouter.get("/", packController.getPacks);
packRouter.get("/:pack_id", packController.getPackById);
packRouter.post("/", validateBody(false, packUpdateSchema, packPostSchema), packController.postPack);
packRouter.patch("/:pack_id", validateBody(true, packUpdateSchema, packPostSchema), packController.updatePack);
packRouter.delete("/:pack_id", packController.deletePack);

export default packRouter;