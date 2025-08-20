import express from "express";
import authHandler from "./../handlers/auth.handler";
import { formValidator } from "../middlewares/FormValidation";
const route = express.Router();

route.post("/register",formValidator, authHandler.registerUser);
// route.post("/login", authHandler.loginUser);


export default route;
