import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginDto, RefreshDto, RegisterDto, VerifyDto } from "./dto/user.dto";
import { ApiResponse } from "src/common/apiResponse";
import { User } from "src/common/decorators";
import { IPayload } from "src/common/types";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/login")
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return new ApiResponse(await this.userService.login(loginDto), 201);
  }

  @Post("/register")
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return new ApiResponse(await this.userService.register(registerDto), 201);
  }

  @Post("/verify")
  @ApiBody({ type: VerifyDto })
  async verify(@Body() verifyDto: VerifyDto) {
    return null;
  }

  @Post("/refresh")
  @ApiBody({ type: RefreshDto })
  async refresh(@Body() refreshDto: RefreshDto) {
    return new ApiResponse(await this.userService.refresh(refreshDto), 201);
  }

  @Post("/logout")
  @ApiBearerAuth()
  async logout(@User() user: IPayload) {
    return new ApiResponse(await this.userService.logout(user.userId));
  }

  @Get("/me")
  @ApiBearerAuth()
  async me(@User() user: IPayload) {
    console.log(user.userId);
    return new ApiResponse(await this.userService.me(user.userId));
  }
}
