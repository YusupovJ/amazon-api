import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { LoginDto, RefreshDto, RegisterDto, VerifyDto } from "./dto/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { compare, hash } from "bcrypt";
import { generateTokens, verifyRefreshToken } from "src/common/tokens";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new BadRequestException("Incorrect email or password");
    }

    const passwordMatch = await compare(loginDto.password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException("Incorrect email or password");
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      role: user.role,
    });

    await this.updateRefresh(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const { email, firstName, lastName, password, role } = registerDto;
    const user = await this.userRepo.findOne({
      where: { email: registerDto.email },
    });

    if (user) {
      throw new BadRequestException("Incorrect email or password");
    }

    const newUser = await this.userRepo.create({
      email,
      firstName,
      lastName,
      password: await hash(password, 10),
      role,
    });

    const { accessToken, refreshToken } = generateTokens({
      userId: newUser.id,
      role: newUser.role,
    });

    await this.userRepo.save(newUser);
    await this.updateRefresh(newUser.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async verify(verifyDto: VerifyDto) {
    return null;
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new BadRequestException("Authorization failed, please login again");
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user.id,
      role: user.role,
    });

    await this.updateRefresh(user.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }
    console.log(id);
    await this.updateRefresh(id, null);

    return "Success logout";
  }

  async me(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    delete user.password;

    return user;
  }

  private async updateRefresh(userId: number, refreshToken: string) {
    await this.userRepo.update(userId, {
      refreshToken,
    });
  }
}
