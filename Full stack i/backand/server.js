import express from "express";
import mongoose from "mongoose";
import userRoutes from "./src/moduls/routs/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =mongodb+srv//<chauhanharshal382>:<X0K5Nauj>@cluster01.tqzyqgp.mongodb.net/
  process.env.MONGO_URI || "mongodb://localhost:27017/fullstack";

// middlewares
app.use(express.json());

// routes
app.use("/api/users", userRoutes);

// health check
app.get("/", (req, res) => res.send("API is running"));

// connect to db and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection error", err);
  });
