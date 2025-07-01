import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hola");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;