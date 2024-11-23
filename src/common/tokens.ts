import { envConfig } from "src/config/env.config";
import { IPayload } from "./types";
import { sign, verify } from "jsonwebtoken";

export const generateAccessToken = (payload: IPayload) => {
  return sign(payload, envConfig.accessToken.secret, {
    expiresIn: envConfig.accessToken.expire,
  });
};

export const generateRefreshToken = (payload: IPayload) => {
  return sign(payload, envConfig.refreshToken.secret, {
    expiresIn: envConfig.refreshToken.expire,
  });
};

export const generateTokens = (payload: IPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const verifyAccessToken = (accessToken: string): IPayload | undefined => {
  try {
    return verify(accessToken, envConfig.accessToken.secret) as IPayload;
  } catch (error) {
    return undefined;
  }
};

export const verifyRefreshToken = (refreshToken: string): IPayload | undefined => {
  try {
    return verify(refreshToken, envConfig.refreshToken.secret) as IPayload;
  } catch (error) {
    return undefined;
  }
};
