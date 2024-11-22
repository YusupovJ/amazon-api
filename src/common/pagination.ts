export class Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  offset: number;

  constructor(page: number = 1, limit: number = 15, totalItems: number) {
    this.page = page;
    this.limit = limit;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / limit);
    this.offset = (page - 1) * limit;
  }
}
