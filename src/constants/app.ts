const isDevelopment = process.env.NODE_ENV !== 'production';

export const ROOT_URL = isDevelopment
  ? `http://localhost:${process.env.NEXT_PUBLIC_PORT}`
  : `${process.env.NEXT_PUBLIC_PRODUCT}`;

export const URL_ONE_PAY_TEST = 'https://mtf.onepay.vn/paygate/vpcpay.op';

export const API_APP = isDevelopment
  ? process.env.NEXT_PUBLIC_URL_API_DEV
  : process.env.NEXT_PUBLIC_URL_API;
export const USER_KEY = 'ASV_REFRESH_KEY';
export const USER_ACCESS_KEY = 'ASV_ACCESS_KEY';
export const USER_COOKIE_KEY = 'ASV_COOKIE_KEY';
export const DEFAULT_LIMIT = 10;
