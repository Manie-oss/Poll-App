import express from "express";
import authRoutes from "./auth.routes";
import pollRoutes from "./poll.routes";
import userRoutes from "./user.routes";

const route = express.Router();

route.use('/auth', authRoutes);
route.use('/poll', pollRoutes);
route.use('user', userRoutes);

export default route;