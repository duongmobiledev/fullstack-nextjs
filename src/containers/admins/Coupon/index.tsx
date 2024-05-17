import { ChevronDownIcon } from '@heroicons/react/outline';
import { useState } from 'react';

import { Search } from '@components/Search';

import { FormCreateCoupon, TableCoupon } from './components';
import { CouponContext, ECouponType } from './components/context';

interface ICouponAdminProps {}

export const CouponAdmin: React.FC<ICouponAdminProps> = (props) => {
  const [couponType, setCouponType] = useState<ECouponType>(ECouponType.PROMO);
  return (
    <div className="p-4 bg-white sm:px-6 lg:px-8 ">
      <CouponContext.Provider
        value={{ couponType: couponType, setCouponType: setCouponType }}>
        <FormCreateCoupon />
        <TableCoupon />
      </CouponContext.Provider>
    </div>
  );
};
export default CouponAdmin;
