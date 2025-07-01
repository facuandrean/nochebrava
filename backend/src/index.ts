import express from "express";
import config from "./config";

import productRouter from "./v1/routes/productRoutes";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hola");
});

app.use("/api/v1/products", productRouter);

app.listen(config.port, () => {
  console.log(`Server is running on port 3000. http://localhost:${config.port}`);
});

export default app;