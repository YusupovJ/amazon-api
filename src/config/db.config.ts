import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/modules/user/entity/user.entity";

export const dbConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "amazon",
  entities: [User],
  synchronize: true,
};
