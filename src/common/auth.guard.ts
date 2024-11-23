import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { verifyAccessToken } from "./tokens";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(" ")[1];
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

    if (!accessToken) {
      throw new UnauthorizedException("You must be authorized");
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      throw new ForbiddenException("Authentification failed, please log in again");
    }

    request.role = payload.role;
    request.userId = payload.userId;

    if (!roles.length) {
      return true;
    }

    if (!roles.includes(payload.role)) {
      throw new ForbiddenException("Access forbidden");
    }

    return true;
  }
}
