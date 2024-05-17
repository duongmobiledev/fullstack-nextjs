import { IUser, IService, IPackage, IDailyLimit } from '@typings';

export interface ILicense {
  _id?: number;
  user?: IUser;
  numberOfMonths?: number;
  service?: IService;
  package?: IPackage;
  expirationTimestamp?: number;
  dailyLimit?: IDailyLimit;
  useCoupon?: boolean;
  isSupport1v1?: boolean;
}

export interface IPackageFeature {
  _id?: number;
  name?: string;
  description?: string;
  price?: number;
  standar?: boolean;
  pro?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface IGetPackagePage {
  serviceId: string;
}
export interface IPackagePage {
  packages?: IPackage[];
  contentTable?: Content[];
}
interface Content {
  [key: string]: boolean | string;
}
export interface IMonthPackage {
  month?: number;
  text?: string;
  name?: string;
  level?: number;
  id_package?: string;
  discount?: number;
  price?: number;
}
export interface IPayment {
  serviceId: string;
  amount: number;
  packageId: string;
  numberOfMonths: number;
  isSupport1v1: boolean;
  couponCode: string;
  numberOfMonthsUpgrade?: number;
  isUpgrade?: boolean;
  userRefCode?: number;
}
export interface IPaymentRespon {
  link: string;
}
export interface IPackageAll {
  _id?: string;
  name?: string;
  price?: number;
  level?: number;
}

export interface IGetMyInvoiceByService {
  serviceId: string;
  limit: number;
  offset: number;
}
export interface ICancelPaymentRequest {
  orderId: string;
}
export interface IPaymentAgain {
  orderId: string;
}
