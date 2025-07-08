import { Router } from "express";
import { expenseController } from "../../controllers/expenseController";

const expenseRoutes = Router();

expenseRoutes.get("/", expenseController.getExpenses);
expenseRoutes.get("/:expense_id", expenseController.getExpenseById);
expenseRoutes.post("/", expenseController.postExpense);
expenseRoutes.delete("/:expense_id", expenseController.deleteExpense);

export default expenseRoutes;