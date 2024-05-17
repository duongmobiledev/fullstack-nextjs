import {
  IOnePay,
  IUser,
  IPackageFeature,
  IPackage,
  IDailyLimit,
} from '@typings';

export interface IService {
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  packages?: IPackage[];
  license?: {
    _id?: number;
    user?: IUser;
    numberOfMonths?: number;
    expirationTimestamp?: number;
    dailyLimit?: IDailyLimit;
    useCoupon?: boolean;
    isSupport1v1?: boolean;
    package?: IPackage;
  };
  isActive: boolean | false;
}

export interface IRequestLoadServices {
  offset: number;
  limit: number;
}
export interface IRequestLoadServicesDetail {
  id: string;
}
export interface IRequestApplyRenewalCoupon {
  code: string;
  serviceId: string;
}
export interface IDataServicesResponse {
  total: number;
  items: IService[];
}
export interface IRequestOnePay {
  key: keyof IOnePay;
  value: any;
}
export interface IGetDetailService {
  id: string;
}
