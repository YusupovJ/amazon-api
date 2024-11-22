import { IPagination } from "./types";

export class ApiResponse {
  data: any;
  status: number;
  pagination: IPagination | null;
  date: Date;

  constructor(data: any, status: number = 200, pagination: IPagination | null = null) {
    this.data = data;
    this.status = status;
    this.pagination = pagination;
    this.date = new Date();
  }
}
