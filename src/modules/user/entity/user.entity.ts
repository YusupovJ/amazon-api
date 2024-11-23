import { RootEntity } from "src/common/entity/root.entity";
import { RoleEnum } from "src/common/enums";
import { TRoles } from "src/common/types";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends RootEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column("enum", { enum: RoleEnum, default: RoleEnum.user })
  role: TRoles;

  @Column()
  firstName: string;

  @Column("boolean", { default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column("int", { nullable: true })
  otp?: number;

  @Column("datetime", { nullable: true })
  expiresAt?: Date;
}
