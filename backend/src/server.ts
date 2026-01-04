import express from "express";
import type { Express, Request, Response } from "express";
import cors from "cors";
import cookierParser from "cookie-parser";
import env from "./utils/env.js";
import AuthRouter from "./routes/auth/auth.routes";
import AdminRouter from "./routes/admin/admin.routes";

const app: Express = express();

const PORT: number = env.PORT;

// middlewares
app.use(cors());
app.use(cookierParser());
app.use(express.json());

// routes
app.use("/auth", AuthRouter);
app.use("/super-admin", AdminRouter);

// 404 route
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, (): void => console.log(`server has started on port ${PORT}`));
