import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { tokenTypes } from "../utils/enums";
import { IUserDoc } from "../interfaces/models/user.types";
import { TokenModel } from "../models/token.model";
import { ApiError } from "../utils";

export interface jwtPayload {
    tokenType: tokenTypes,
    userId: string,
    exp: number,
    iat: number 
}

const secretKey = process.env.SECRET_KEY || "default_key";

export function generateToken(
  userId: string,
  expires: Date,
  tokenType: tokenTypes
): string {
  const payload: jwtPayload = { userId, exp: Math.floor(new Date(expires).getTime() / 1000), iat: Math.floor(new Date().getTime()/1000), tokenType };
  console.log('payload: ', payload);
  return jwt.sign(payload, secretKey);
}

export async function saveToken(userId: string, token: string, expires: Date, tokenType: tokenTypes) {
  return TokenModel.create({userId, token, tokenType,expires })
}

function addMinutesToDate(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

export async function generateAuthToken(user: IUserDoc) {
  const now = new Date();
  const accessTokenExpiresAt = addMinutesToDate(now, 60);
  const accessToken = generateToken(
    user._id,
    accessTokenExpiresAt,
    tokenTypes.ACCESS
  );
  console.log('accesstoken: ', accessToken)
  console.log('accesstoken: ', accessTokenExpiresAt);
  const refreshTokenExpiresAt = addMinutesToDate(now, 90);
  const refreshToken = generateToken(
    user._id,
    refreshTokenExpiresAt,
    tokenTypes.REFRESH
  );
  await saveToken( user._id, refreshToken, refreshTokenExpiresAt, tokenTypes.REFRESH);
  return {accessToken, refreshToken}
}

export function verifyToken(token: string, type: tokenTypes){
    const payload = jwt.verify(token, secretKey) as jwtPayload;
    const tokenDoc = TokenModel.findOne({token, tokenType: type, userId: payload.userId })
    if(!tokenDoc){
        throw new ApiError(httpStatus.UNAUTHORIZED, "token not found")
    }
    return tokenDoc;
}
