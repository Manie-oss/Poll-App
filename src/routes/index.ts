import express from "express";
import authRoutes from "./auth.routes";


const route = express.Router();

route.use('/auth', authRoutes);

export default route;