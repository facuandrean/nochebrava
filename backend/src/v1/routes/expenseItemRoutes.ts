import { Router } from "express";
import { expenseItemController } from "../../controllers/expenseItemController";
import { validateBody } from "../../middlewares/validateBody";
import { expenseItemsScheme } from "../../schemas/expenseItemSchema";

const expenseItemRouter = Router();

expenseItemRouter.get("/", expenseItemController.getExpenseItems);
expenseItemRouter.get("/:expense_item_id", expenseItemController.getExpenseItemById);
expenseItemRouter.post("/", validateBody(false, expenseItemsScheme, expenseItemsScheme), expenseItemController.postExpenseItem);
expenseItemRouter.delete("/:expense_item_id", expenseItemController.deleteExpenseItem);

// expenseItemRouter.get("/:expense_id/items", expenseItemController.getExpenseItemsByExpenseId);

export default expenseItemRouter;