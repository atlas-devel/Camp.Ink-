import express from "express";
import type { Router, Request, Response } from "express";
import { register_user } from "../../controllers/super_admin.controller";

const AdminRouter: Router = express.Router();

AdminRouter.post("/register-user", register_user);
AdminRouter.get("/get-all-students", (req: Request, res: Response) =>
  res.send(404)
);
AdminRouter.get("/get-student/:id", (req: Request, res: Response) =>
  res.send(404)
);
AdminRouter.get("/get-all-print-stuff", (req: Request, res: Response) =>
  res.send(404)
);
AdminRouter.get("/get-print-stuff/:id", (req: Request, res: Response) =>
  res.send(404)
);
AdminRouter.delete("/delete-student/:id", (req: Request, res: Response) =>
  res.send(404)
);
AdminRouter.delete("/delete-print-stuff/:id", (req: Request, res: Response) =>
  res.send(404)
);
AdminRouter.patch("/update-student/:id", (req: Request, res: Response) =>
  res.send(404)
);
AdminRouter.patch("/update-print-stuff/:id", (req: Request, res: Response) =>
  res.send(404)
);
AdminRouter.get("/filter-students", (req: Request, res: Response) =>
  res.send(404)
);

export default AdminRouter;
