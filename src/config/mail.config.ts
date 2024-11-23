import { MailerOptions } from "@nestjs-modules/mailer";
import { envConfig } from "./env.config";

export const mailConfig: MailerOptions = {
  transport: {
    host: envConfig.email.host,
    secure: false,
    auth: {
      user: envConfig.email.user,
      pass: envConfig.email.password,
    },
  },
};
