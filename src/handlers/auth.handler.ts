import { Request, Response } from "express";
import { encryptText, compareText, catchError, ApiError } from "./../utils";
import sendEmail from "../utils/sendMail";
import { UserModel } from "../models/user.model";
import crypto from "crypto";
import httpStatus from "http-status";
import { generateAuthToken } from "../services/token.service";
import { IUserDoc } from "../interfaces/models/user.types";

async function registerUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      res.status(409).send({ message: "User already exists." });
    }
    const hashedPass = await encryptText(password);
    const user = { email, firstName, lastName, password: hashedPass };

    const userDoc = new UserModel(user);

    const [error, resp] = await sendVerficationEmail(userDoc, req, res);
    if (error) res.status(500).send({ message: error.message });
    
    const[savedDocError, savedDoc ] = await catchError(userDoc.save());

    if(savedDocError) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, savedDocError.message);

    res
      .status(201)
      .send({ message: "User registered successfully", user: savedDoc }); 

}

async function sendVerficationEmail(data: any, req: Request, res: Response) {
  const token = data.getVerificationToken();

  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/verifyemail/${token}`;
  const message = `Please verify your email by clicking the following link: ${verificationUrl}`;

  return sendEmail({
    email: data.email,
    subject: "Email Verification",
    message,
  });
}

async function verifyEmail(req: Request, res: Response){
  const {token} = req.params;
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await UserModel.findOne({
    verificationToken: hashedToken,
    verificationTokenExpire: { $gt: Date.now() },
  });

  if(!user){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired token');
  }

  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;

  await user.save();
  res.redirect('http://localhost:3000/login');
}

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const userData: IUserDoc | null = await UserModel.findOne({ email });
  if (userData) {
    const isPasswordMatched = await compareText(password, userData.password);
    if (isPasswordMatched && userData.isEmailVerified) {
      const token = await generateAuthToken(userData);
      return res.status(200).send({ message: "user logged in successfully", data: {user: userData, token} });
    }
    if (!isPasswordMatched || !userData.isEmailVerified) {
      const errorMessage = isPasswordMatched ? "please verify your email to login" : "Incorrect Password." ;
      throw new ApiError(httpStatus.UNAUTHORIZED, errorMessage);
    }
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, "Account not registered yet. Register to Login"); 
}

export default { registerUser, verifyEmail, loginUser };
