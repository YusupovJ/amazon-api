import { config } from "dotenv";

config();

export const envConfig = {
  port: (process.env.PORT || 7777) as number,
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET as string,
    expire: process.env.ACCESS_TOKEN_EXPIRE as string,
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET as string,
    expire: process.env.REFRESH_TOKEN_EXPIRE as string,
  },
};
