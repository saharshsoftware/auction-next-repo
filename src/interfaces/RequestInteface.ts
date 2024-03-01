export interface IRequest {
  API?: string;
  DATA?: any;
  timeout?: number;
}

export interface IActionResponse {
  data?: any
  success?: (response?: any) => void;
  fail?: (error: any) => void;
}