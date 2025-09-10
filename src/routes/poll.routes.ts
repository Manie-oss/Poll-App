import express from "express";
import validate from "../middlewares/validate";
import { createPoll, updatePoll } from "../validators/poll.validation";
import pollHandler from "../handlers/poll.handler";
import {auth} from './../middlewares/auth';

const route = express.Router();

route.post("/", auth, validate(createPoll), pollHandler.createPoll);
route.get("/", auth, pollHandler.getPolls);
route.get("/user/:userId", auth, pollHandler.getPollsByUserId);
route.get("/:pollId", auth, pollHandler.getPollById);
route.patch("/:pollId", auth, validate(updatePoll), pollHandler.updatePoll);
route.delete("/:pollId", auth, pollHandler.deletePoll);

export default route;
