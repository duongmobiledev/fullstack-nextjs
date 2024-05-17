import * as yup from 'yup';

import { ECouponType, EPromotionType } from './context';

export interface IFormDataCoupon {
  code: string;
  production: string[];
  quality: string;
  validTill: string;
  nameTypeCoupon: string;
  //type promotion
  unitPromotion: string;
  valuePromotion: string;
  //type r
  package: string;
  numberLicense: string;
  limit: string;
}
const requires = 'Không được bỏ trống !';
export const schema = yup
  .object()
  .shape<{ [key in keyof IFormDataCoupon]: any }>({
    code: yup.string().required(requires),
    production: yup.array(yup.string()).required(requires),
    quality: yup.string().required(requires),
    validTill: yup.string().required(requires),
    package: yup.string().when('nameTypeCoupon', {
      is: (value) => value == ECouponType.RENEWAL,
      then: yup.string().required(requires),
    }),
    numberLicense: yup.string().when('nameTypeCoupon', {
      is: (value) => value == ECouponType.RENEWAL,
      then: yup.string().required(requires),
    }),

    limit: yup.string().when('nameTypeCoupon', {
      is: (value) => value == ECouponType.RENEWAL,
      then: yup.string().min(1, 'Vui lòng lớn hơn 1').required(requires),
    }),
    unitPromotion: yup.string().when('nameTypeCoupon', {
      is: (value) => value == ECouponType.PROMO,
      then: yup.string().required(requires),
    }),
    valuePromotion: yup.string().when('nameTypeCoupon', {
      is: (value) => value == ECouponType.PROMO,
      then: yup
        .string()
        .required(requires)
        .when('unitPromotion', {
          is: (value) => value == EPromotionType.PERCENT,
          then: yup
            .string()
            .test(
              'checkPercent',
              'Vui lòng nhập < 100',
              (value) => Number(value) < 100 && Number(value) > 0
            ),
        }),
    }),

    nameTypeCoupon: '',
  });
