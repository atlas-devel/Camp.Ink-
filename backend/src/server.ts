import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookierParser from "cookie-parser";
import env from "./utils/env.js";
import AuthRouter from "./routes/auth.routes.js";

const app: Express = express();

const PORT: number = env.PORT;

// middlewares
app.use(cors());
app.use(cookierParser());
app.use(express.json());

// routes
app.use("/auth", AuthRouter);

app.listen(PORT, (): void => console.log(`server has started on port ${PORT}`));
