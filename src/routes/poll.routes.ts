import express from "express";
import validate from "../middlewares/validate";
import { createPoll } from "../validators/poll.validation";
import pollHandler from "../handlers/poll.handler";
import {auth} from './../middlewares/auth';

const route = express.Router();

route.post("/", auth, validate(createPoll), pollHandler.createPoll);
route.get("/", auth, pollHandler.getPolls);
route.get("/my-polls", auth, pollHandler.getUserPolls);

export default route;
