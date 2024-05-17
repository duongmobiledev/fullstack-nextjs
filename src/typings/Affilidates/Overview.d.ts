import { IInvoice } from '../OnePay';

export interface IOverviewAffilidate {
  linkRef: string;
  discountCommission: number;
  balance: number;
  discount: number;
  users: IPresentee[];
  invoices: IInvoice[];
}
export interface IPresentee {
  _id: string;
  accountId: number;
  email: string;
  referrer: number;
  created_at: string;
  updated_at: string;
}
export interface IInvoicesReceiveCommissionResponse {
  items: IInvoice[];
  total: number;
}
export interface IPresenteeResponse {
  items: IPresentee[];
  total: number;
}

export interface IWithdrawRequest {
  amount: number | string;
  bankAccountName: sting;
  bankAccountNumber: string;
  bankName: string;
  facebookLink: string;
  email?: string;

  //
  balance?: number;
}
