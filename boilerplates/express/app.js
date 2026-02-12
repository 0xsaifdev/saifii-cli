import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";

import { corsOptions } from "./constants/config.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";

const app = express();

app.use(cors(corsOptions));
app.use(express.json);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${envMode} mode`);
});

export { envMode };
