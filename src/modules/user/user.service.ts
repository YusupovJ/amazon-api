import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { LoginDto, RefreshDto, RegisterDto, VerifyDto } from "./dto/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { compare, hash } from "bcrypt";
import { generateTokens, verifyRefreshToken } from "src/common/tokens";
import { MailerService } from "@nestjs-modules/mailer";
import { addMinutes, exclude, generateOtp } from "src/common/helpers";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly mailService: MailerService,
  ) {}

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

    if (!user.isVerified) {
      const otp = await this.sendOtp(user.email);

      await this.userRepo.update(user.id, {
        otp,
        expiresAt: addMinutes(5),
      });

      return "Code was sent";
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      role: user.role,
    });

    await this.updateRefresh(user.id, refreshToken);

    return exclude({ accessToken, ...user }, ["expiresAt", "otp", "password"]);
  }

  async register(registerDto: RegisterDto) {
    const { email, firstName, lastName, password, role } = registerDto;
    const user = await this.userRepo.findOne({
      where: { email: registerDto.email },
    });

    if (user) {
      throw new BadRequestException("Incorrect email or password");
    }

    const otp = await this.sendOtp(email);

    const newUser = await this.userRepo.create({
      email,
      firstName,
      lastName,
      password: await hash(password, 10),
      role,
      otp,
      expiresAt: addMinutes(5),
    });

    await this.userRepo.save(newUser);

    return "Code was sent";
  }

  async verify(verifyDto: VerifyDto) {
    const user = await this.userRepo.findOne({
      where: { email: verifyDto.email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isVerified) {
      throw new BadRequestException("User already verified");
    }

    const otpMatch = user.otp === verifyDto.otp;

    if (!otpMatch) {
      throw new BadRequestException("Incorrect code");
    }

    const isExpired = new Date(user.expiresAt) < new Date();

    if (isExpired) {
      throw new BadRequestException("Code expired");
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      role: user.role,
    });

    await this.userRepo.update(user.id, {
      refreshToken,
      otp: null,
      isVerified: true,
      expiresAt: null,
    });

    return exclude({ accessToken, ...user }, ["expiresAt", "otp", "password"]);
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

    return exclude({ accessToken, ...user }, ["expiresAt", "otp", "password"]);
  }

  async logout(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }
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

    return exclude(user, ["expiresAt", "otp", "password"]);
  }

  private async updateRefresh(userId: number, refreshToken: string) {
    await this.userRepo.update(userId, {
      refreshToken,
    });
  }

  private async sendOtp(email: string) {
    const otp = generateOtp();

    await this.mailService.sendMail({
      to: email,
      subject: "Account verification",
      text: otp.toString(),
    });

    return otp;
  }
}
