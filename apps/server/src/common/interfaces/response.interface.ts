export interface IResponse<T = any> {
  success: boolean;
  message: string;
  errorMessage: string;
  data: T | T[];
  error: any;
}
