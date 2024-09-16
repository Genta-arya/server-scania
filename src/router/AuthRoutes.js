import express from "express";
import { handleRegister } from "../controller/Authentikasi/AuthController.js";


const AuthRouter = express.Router();

AuthRouter.post("/register" , handleRegister)
export default AuthRouter