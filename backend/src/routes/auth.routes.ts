import { login, logout } from "./../controllers/auth.controller";
import type { Router } from "express";
import express from "express";

const AuthRouter: Router = express.Router();
AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);
export default AuthRouter;
