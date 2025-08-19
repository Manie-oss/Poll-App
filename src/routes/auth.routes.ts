import express from "express";
import authHandler from "./../handlers/auth.handler";
const route = express.Router();

route.post("/register", authHandler.registerUser); //todo: validation middleware implementaion
// route.post("/login", authHandler.loginUser);


export default route;
