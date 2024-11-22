import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { TRoles } from "src/common/types";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ enum: ["vendor", "user"], default: "user" })
  role?: TRoles;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class RefreshDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}

export class VerifyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  otp: string;
}
