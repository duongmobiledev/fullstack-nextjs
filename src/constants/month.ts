import { IMonthPackage } from '@typings';

import { DISCOUNT_12_MONTH, DISCOUNT_6_MONTH } from './payment';

export const months: IMonthPackage[] = [
  {
    month: 2,
    text: '2 tháng',
  },
  {
    month: 6,
    text: '6 tháng',
    discount: DISCOUNT_6_MONTH,
  },
  {
    month: 12,
    text: '12 tháng',
    discount: DISCOUNT_12_MONTH,
  },
];
