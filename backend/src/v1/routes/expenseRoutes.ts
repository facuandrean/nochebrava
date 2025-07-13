import { Router } from "express";
import { expenseController } from "../../controllers/expenseController";
import { validateBody } from "../../middlewares/validateBody";
import { expenseBodyScheme } from "../../schemas/expenseSchema";

const expenseRoutes = Router();

expenseRoutes.get("/", expenseController.getExpenses);
expenseRoutes.get("/:expense_id", expenseController.getExpenseById);
expenseRoutes.post("/", validateBody(false, expenseBodyScheme, expenseBodyScheme), expenseController.postExpense);
expenseRoutes.delete("/:expense_id", expenseController.deleteExpense);

expenseRoutes.get("/:expense_id/items", expenseController.getExpenseItems);

export default expenseRoutes;