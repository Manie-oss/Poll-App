import express from "express";
import authHandler from "./../handlers/auth.handler";
import { login, register } from "../validators/auth.validation";
import validate from "../middlewares/validate";
const route = express.Router();

route.post("/register", validate(register), authHandler.registerUser);
route.get("/verifyemail/:token", authHandler.verifyEmail);
route.post("/login", validate(login), authHandler.loginUser);


export default route;
