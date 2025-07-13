import express from "express";
import cors from "cors";
import config from "./config";

import productRouter from "./v1/routes/productRoutes";
import categoryRouter from "./v1/routes/categoryRoutes";
import productCategoryRouter from "./v1/routes/productCategoryRoutes";
import orderRouter from "./v1/routes/orderRoutes";
import detailOrderRouter from "./v1/routes/detailOrderRoutes";
import packRouter from "./v1/routes/packRoutes";
import packItemRouter from "./v1/routes/packItemRoutes";
import paymentMethodRouter from "./v1/routes/paymentMethodRoutes";
import itemTypeRouter from "./v1/routes/itemTypeRoutes";
import expenseRouter from "./v1/routes/expenseRoutes";
import expenseItemRouter from "./v1/routes/expenseItemRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products-category", productCategoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/detail-orders", detailOrderRouter);
app.use("/api/v1/packs", packRouter);
app.use("/api/v1/pack-items", packItemRouter);
app.use("/api/v1/payment-methods", paymentMethodRouter);
app.use("/api/v1/item-types", itemTypeRouter);
app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/expense-items", expenseItemRouter);

app.listen(config.port, () => {
  console.log(`Server is running on port 3000. http://localhost:${config.port}`);
});

export default app;