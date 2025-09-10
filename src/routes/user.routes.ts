import express from "express";
import validate from "../middlewares/validate";
import userHandler from "../handlers/user.handler";
import {auth} from './../middlewares/auth';
import { updateUser } from "../validators/user.validation";

const route = express.Router();

route.patch("/:userId", auth, validate(updateUser), userHandler.updateUser);
route.delete("/:userId", auth, userHandler.deleteUser);

export default route;