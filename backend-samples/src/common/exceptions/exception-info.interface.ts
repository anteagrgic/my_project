export interface ICustomExceptionInfo extends Record<string, string | number> {
  status: number;
  code: string;
  detail: string;
}

export interface IExceptionInfo extends ICustomExceptionInfo {
  exception: string;
}
