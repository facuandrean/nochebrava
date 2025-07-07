import express from "express";
import config from "./config";

import productRouter from "./v1/routes/productRoutes";
import categoryRouter from "./v1/routes/categoryRoutes";
import productCategoryRouter from "./v1/routes/productCategoryRoutes";
import packRouter from "./v1/routes/packRoutes";
import packItemRouter from "./v1/routes/packItemRoutes";
import paymentMethodRouter from "./v1/routes/paymentMethodRoutes";

const app = express();
app.use(express.json());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products-category", productCategoryRouter);
app.use("/api/v1/packs", packRouter);
app.use("/api/v1/pack-items", packItemRouter);
app.use("/api/v1/payment-methods", paymentMethodRouter);

app.listen(config.port, () => {
  console.log(`Server is running on port 3000. http://localhost:${config.port}`);
});

export default app;