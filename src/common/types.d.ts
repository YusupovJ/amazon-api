import { RoleEnum } from "./enums";

export interface IPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  offset: number;
}

export interface IPayload {
  userId: number;
  role: TRoles;
}

export type TRoles = "user" | "vendor" | "admin";
