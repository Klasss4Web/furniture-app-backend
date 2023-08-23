const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const productRouter = require("./routes/productRoutes");
const port = process.env.PROT || 3000;

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("YEAH!!! DB CONNECTED!!!"))
  .catch((err) => console.log("OPPS DB DIDNT CONNECT", err));

// app.get("/", (req, res) => res.send("Hello World!"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/v1/products", productRouter);

app.listen(port, () => console.log(`Furniture app listening on port ${port}!`));
