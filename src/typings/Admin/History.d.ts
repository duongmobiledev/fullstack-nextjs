import { IUser } from '@typings';

export interface IHistoryAdminRequest {
  email: string;
  fromDate: string;
  toDate: string;
  offset: number;
  limit: number;
}
export interface ISearchHistoryRequest {
  email: string;
}
export interface IDataHistory {
  items?: IHistoryAdmin[];
  total?: number;
}
export interface IHistoryAdmin {
  _id?: string;
  user?: IUser;
  action?: string;
  created_at?: string;
  updated_at?: string;
}
