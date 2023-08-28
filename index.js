const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();

const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const favouritesRouter = require("./routes/favouritesRoutes");

dotenv.config();

const port = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("YEAH!!! DB CONNECTED!!!"))
  .catch((err) => console.log("OPPS DB DIDNT CONNECT", err));

// app.get("/", (req, res) => res.send("Hello World!"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/favourites", favouritesRouter);
app.use("/api/v1/user", userRouter);

app.listen(port, () => console.log(`Furniture app listening on port ${port}!`));
