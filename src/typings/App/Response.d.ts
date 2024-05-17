export interface IResponse {
  message?: string;
  data?: any;
  status?: 'Success' | 'Failure';
  success?: boolean;
}
