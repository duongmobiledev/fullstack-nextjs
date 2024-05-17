import { IUser } from '@typings';

export interface IOnePayResult {
  _id?: string;
  user?: IUser;
  service?: IService;
  invoice?: IInvoice;
  expirationTimestamp?: number;
  dailyLimit?: number;
  status?: string;
  message?: string;
}

export interface IInvoice {
  _id?: string;
  orderId?: string;
  service?: string;
  package?: IPackage;
  user?: IUser;
  status?: string;
  amount?: number;
  numberOfMonths?: number;
  numberOfMonthsUpgrade?: number;
  merchTxnRef?: string[];
  currencyCode?: string;
  locale?: string;
  message?: string;
  txnResponseCode?: string;
  isSupport1v1?: boolean;
  created_at?: string;
  referrerCode?: number;
  discount?: number;
  couponCode?: number;
  userRefCode?: number;
}

export interface IPackage {
  _id?: string;
  name?: string;
  price?: number;
  packageFeature?: IPackageFeature[];
  level?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IPackageFeature {
  _id?: string;
  name?: string;
}

export interface IService {
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  packages?: string[];
}

export interface IRequestLicense {
  id?: string;
}
export interface IRequestInvoiceDetail {
  orderId?: string;
}
export interface IInvoiceResponse {
  items: IInvoice[];
  total: number;
}
