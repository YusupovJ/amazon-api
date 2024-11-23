import { Module } from "@nestjs/common";
import { UserModule } from "./modules/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dbConfig } from "./config/db.config";
import { MailerModule } from "@nestjs-modules/mailer";
import { mailConfig } from "./config/mail.config";

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), MailerModule.forRoot(mailConfig), UserModule],
})
export class AppModule {}
