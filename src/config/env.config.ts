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
  email: {
    host: process.env.EMAIL_HOST as string,
    port: process.env.EMAIL_PORT as string,
    user: process.env.EMAIL_USER as string,
    password: process.env.EMAIL_PASSWORD as string,
  },
};
