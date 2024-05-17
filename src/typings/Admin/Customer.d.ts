import { EAffiliateDiscount } from '@common/enum';

import { IUser, IService, IInvoice } from '@typings';

export interface ICustomer {
  balance: number;
  discount: number;
  refCount: number;
  user: IUser;
}
export interface ICustomerRespon {
  items: ICustomer[];
  total: number;
}
export interface IGetLicenseListByUser {
  userId: string;
  limit: number;
  offset: number;
}
export interface ILicenseCustomer {
  _id: string;
  user: IUser;
  service: IService;
  invoice: IInvoice;
  expirationTimestamp: number;
  dailyLimit: IDailyLimit;
  created_at: Date;
  updated_at: Date;
}
export interface IDailyLimit {
  suggestedAudienceLimit: number;
  createAudienceLimit: number;
  libraryLimit: number;
}
export interface ILicenseRespon {
  items: ILicenseCustomer[];
  total: number;
}
export interface IUpdateCustomer {
  userId: string;
  displayName?: string;
  phoneNumber?: string;
  discount?: number;
  isAdmin?: boolean;
  license?: {
    serviceId: string;
    packageId: string;
    expirationTimestamp: number; // UNIX
    dailyLimit?: IDailyLimit;
  };
}
