import express from "express";
import config from "./config";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hola");
});

app.listen(config.port, () => {
  console.log(`Server is running on port 3000. http://localhost:${config.port}`);
});

export default app;