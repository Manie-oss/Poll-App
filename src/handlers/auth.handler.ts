import { Request, Response } from "express";
import { encryptText, compareText, catchError } from "./../utils";
import sendEmail from "../utils/sendMail";
import { UserModel } from "../models/user.model";
import crypto from "crypto";
import { validationResult } from "express-validator";

async function registerUser(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) res.status(422).json({ errors: errors.array() });

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

    if(savedDocError) res.status(500).send({ message: savedDocError.message });

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

// todo: verify email after successfully registering user
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
    res.status(400).json({ message: 'Invalid or expired token' });
    return;
  }

  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;

  await user.save();

  res.status(200).json({ success: true, message: 'Email verified successfully' });
  
}

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const userData = await UserModel.findOne({ email });
  if (userData) {
    const isPasswordMatched = await compareText(password, userData.password);
    if (isPasswordMatched && userData.isEmailVerified) {
      //todo: allow user to login
      res
        .status(200)
        .send({ message: "user logged in successfully", user: userData });
    }
    if (!isPasswordMatched || !userData.isEmailVerified) {
      res
        .status(401)
        .send(
          isPasswordMatched
            ? { message: "please verify your email to login" }
            : { message: "Incorrect Password." }
        );
    }
  }
  res
    .status(401)
    .send({ message: "Account not registered yet. Register to Login" });
}

export default { registerUser, verifyEmail, loginUser };
