import express from "express";
import authRoutes from "./auth.routes";
import pollRoutes from "./poll.routes";

const route = express.Router();

route.use('/auth', authRoutes);
route.use('/poll', pollRoutes);

export default route;