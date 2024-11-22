import { Module } from "@nestjs/common";
import { UserModule } from "./modules/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dbConfig } from "./config/db.config";

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), UserModule],
})
export class AppModule {}
