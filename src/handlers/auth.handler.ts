import { encrypt, catchError } from "./../utils";
import { UserModel } from "../models/user.model";

async function registerUser(req: any, res: any) {
  console.log("req: ", req.body);
  const { email, firstName, lastName, password } = req.body;
  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist) {
    res.status(409).send({ message: "User already exists." });
  }
  const hashedPass = await encrypt(password);
  const user = { email, firstName, lastName, hashedPass, status: "ACTIVE" };
  const [err, data] = await catchError(UserModel.insertOne(user));
  if (err) return;
  res.status(201).send({ message: "User registered successfully", user: data });
}

export default { registerUser };
