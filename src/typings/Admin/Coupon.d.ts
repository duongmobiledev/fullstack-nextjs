import { IService } from '@typings';

export interface ICouponRenewalRequest {
  code: string;
  type: string;
  limit: number;
  validUntil: number;
  services: string[];
  value: IValues;
}
export interface IValues {
  extraTimestamp?: number;
  package?: string;
  dailyLimit?: number;
  price?: number;
  discountBy?: string;
  percent?: number;
}
export interface ICouponListRequest {
  couponCode: string;
  limit: number;
  offset: number;
}
export interface ICouponSearchRequest {
  couponCode: string;
}
export interface ICouponListResponse {
  items?: ICouponList[];
  total?: number;
}
export interface ICouponList {
  value?: IValue;
  _id?: string;
  code?: string;
  users?: string[];
  services?: IService[];
  type?: string;
  status?: boolean;
  validUntil?: number;
  used?: number;
  limit?: number;
  created_at?: string;
  updated_at?: Date;
}

export interface IValue {
  extraTimestamp?: number;
  package?: IPackage;
  dailyLimit?: number;
  price?: number;
  percent?: number;
  discountBy?: string;
}
