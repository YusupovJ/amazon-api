import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from "@nestjs/common";
import { IPayload, TRoles } from "./types";
import { AuthGuard } from "./auth.guard";

export const User = createParamDecorator((_: unknown, ctx: ExecutionContext): IPayload => {
  const request = ctx.switchToHttp().getRequest();
  return { userId: request.userId, role: request.role };
});

export const Auth = (...roles: TRoles[]) => applyDecorators(SetMetadata("roles", roles), UseGuards(AuthGuard));
