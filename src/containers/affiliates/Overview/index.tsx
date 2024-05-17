import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAffiliateProgram } from '@redux/actions/affiliate';

import { IRootState } from '@typings';

import Chart from './Chart';
import DiscountCommissions from './DiscountCommissions';
import Presentee from './Presentee';
import RefLink from './RefLink';
import RemainCommission from './RemainCommission';
import UserCommission from './UserCommission';

interface IOverview {}
const Overview: React.FC<IOverview> = (props) => {
  const { overview } = useSelector((state: IRootState) => state.affilidate);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAffiliateProgram());
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 lg:gap-6 lg:grid-cols-2">
        <div className="col-span-1">
          <div className="grid justify-between h-full grid-cols-2 gap-3 lg:gap-6">
            <div className="col-span-2">
              <RefLink />
            </div>
            <div className="col-span-1">
              <DiscountCommissions />
            </div>
            <div className="col-span-1">
              <RemainCommission />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <Chart />
        </div>
      </div>
      <div className="mt-3">
        <Presentee />
        <UserCommission />
      </div>
    </div>
  );
};

export default Overview;
