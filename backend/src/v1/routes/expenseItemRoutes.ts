import { Router } from "express";
import { expenseItemController } from "../../controllers/expenseItemController";
import { validateBody } from "../../middlewares/validateBody";
import { expenseItemsScheme } from "../../schemas/expenseItemSchema";

const expenseItemRouter = Router();

expenseItemRouter.post("/", validateBody(false, expenseItemsScheme, expenseItemsScheme), expenseItemController.postExpenseItem);
expenseItemRouter.delete("/:expense_item_id", expenseItemController.deleteExpenseItem);

export default expenseItemRouter;