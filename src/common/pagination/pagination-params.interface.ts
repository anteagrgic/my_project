export interface IPaginationParams {
  page: number;
  limit: number;
  get skip(): number;
}
