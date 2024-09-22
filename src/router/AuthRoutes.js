import express from "express";
import { checkLogin, handleLogin, handleLogout, handleRegister } from "../controller/Authentikasi/AuthController.js";

const AuthRouter = express.Router();
AuthRouter.post("/register" , handleRegister)
AuthRouter.post("/login" , handleLogin)
AuthRouter.post("/user" , checkLogin)
AuthRouter.post("/logout" , handleLogout)
export default AuthRouter