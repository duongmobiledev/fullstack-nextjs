import { EStatus } from '@common/enum';

import { IUser, IService, IPackage } from '@typings';

export interface IOrder {
  orderId: string;
  service: IService;
  package: IPackage;
  user: IUser;
  status: EStatus;
  amount: number;
  numberOfMonths: number;
  numberOfMonthsUpgrade: number;
  currencyCode: string;
  isSupport1v1: string;
  isUpgrade: true;
  referrerCode: number;
  referrerDiscount: number;
  created_at: Date;
  couponCode: string;
}
export interface IOrderRespon {
  items: IOrder[];
  total: number;
}
export interface IGetListWithKeyValue {
  key?: string;
  value?: string;
  offset?: number;
  limit?: number;
}
