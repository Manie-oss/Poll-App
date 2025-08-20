import { Request, Response } from "express";
import { encryptText, compareText, catchError } from "./../utils";
import { UserModel } from "../models/user.model";
import { IUser } from "../interfaces/models/user.types";
import { validationResult } from "express-validator";

async function registerUser(req: Request, res: Response) {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const { email, firstName, lastName, password } = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      res.status(409).send({ message: "User already exists." });
    }
    const hashedPass = await encryptText(password);
    const user = { email, firstName, lastName, password: hashedPass };
    const [err, data] = await catchError(UserModel.create(user));
    if (err){
     res.status(500).send({message: err.message});
    };
    res.status(201).send({ message: "User registered successfully", user: data });
  }
  res.status(422).json({errors: errors.array()})
};

async function loginUser(req: Request, res: Response){
  const {email, password} = req.body;
  const userData = await UserModel.findOne({ email }); 
  if(userData){
    const isPasswordMatched = await compareText(password, userData.password);
    if(isPasswordMatched && userData.isEmailVerified){
      //todo: allow user to login
      res.status(200).send({message: 'user logged in successfully'})
    }
    if(!isPasswordMatched || !userData.isEmailVerified){
      res.status(401).send(isPasswordMatched ? {message: 'please verify your email to login'} : {message: 'Incorrect Password.'} );
    }
  }
  res.status(401).send({message: 'Account not registered yet. Register to Login'})
};
  
export default { registerUser, loginUser };
