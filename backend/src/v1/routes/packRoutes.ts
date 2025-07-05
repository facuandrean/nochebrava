import { Router } from "express";
import { packController } from "../../controllers/packController";

const packRouter = Router();

packRouter.get("/", packController.getPacks);
packRouter.get("/:pack_id", packController.getPackById);
packRouter.post("/", packController.postPack);
packRouter.patch("/:pack_id", packController.updatePack);
packRouter.delete("/:pack_id", packController.deletePack);

export default packRouter;