import { ICountry } from '@typings';

import { refreshToken } from './../../redux/actions/auth';

export interface IGender {
  name: string;
  code: number;
}
export interface ILoginEmail {
  email: string;
  'g-recaptcha-response': string;
  ref?: number;
  callback_url?: string;
}
export interface ILoginAuthorize {
  loginToken: string;
}
export interface INotification {
  typeNotification?: NameNotify;
  value?: boolean;
  _id?: string;
}
export type NameNotify = 'updates' | 'invoices' | 'promotions';
export interface IUser {
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  gender?: number;
  notifications?: INotification[];
  balance?: number;
  created_at?: Date;
  refId?: string;
  updated_at?: Date;
  _id?: string;
  referrer?: number;
  refreshToken?: string;
  accessToken?: string;
  accountId?: number;
  address?: string;
  zipCode?: string;
  state?: string;
  isAdmin?: boolean;
}
export interface IRefreshToken {
  refreshToken: string;
}
export interface IUserProfile {
  displayName?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  gender?: number;
  notifications?: INotification[];
  address?: string;
  state?: string;
  zipCode?: string;
}
