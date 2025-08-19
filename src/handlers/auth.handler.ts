import { Request, Response } from "express";
import { encrypt, catchError } from "./../utils";
import { UserModel } from "../models/user.model";
import { IUser } from "../interfaces/models/user.types";

type User = Omit<IUser, "password">;

async function registerUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;
  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist) {
    res.status(409).send({ message: "User already exists." });
  }
  const hashedPass = await encrypt(password);
  const user = { email, firstName, lastName, password: hashedPass, status: "ACTIVE" };
  const [err, data] = await catchError(UserModel.create(user));
  if (err){
    res.status(500).send({message: err.message});
  };
  res.status(201).send({ message: "User registered successfully", user: data });
}

export default { registerUser };
