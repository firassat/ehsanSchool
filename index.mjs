import express from "express";
import {
  user,
  auth,
  requests,
  manager,
  studentsRoutes,
} from "./Routes/index.js";
import connectDb from "./config/conectDb.mjs";
import { configDotenv } from "dotenv";
import { notfound, errorHandler } from "./middleware/errorMiddleware.mjs";
import cors from "cors";

configDotenv();
connectDb();
const app = express();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(express.json());

app.use(cors());

app.use("/api", studentsRoutes);
app.use("/api", user);
app.use("/api", auth);
app.use("/api", requests);
app.use("/api", manager);
app.use(notfound);
app.use(errorHandler);

app.listen(8000, "0.0.0.0", () => {
  console.log("server is running");
});
