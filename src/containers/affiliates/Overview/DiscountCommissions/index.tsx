import { useSelector } from 'react-redux';

import { formatCurrencyVND } from '@common/functions';

import { IRootState } from '@typings';

interface IAccumulatedCommissions {}

const AccumulatedCommissions: React.FC<IAccumulatedCommissions> = (props) => {
  const { overview } = useSelector((state: IRootState) => state.affilidate);
  return (
    <div className="h-full px-2 pt-2 pb-8 bg-white rounded-lg">
      <h5 className="text-sm font-bold text-center lg:text-lg">
        Hoa hồng tích lũy
      </h5>
      <p className="mt-4 text-lg font-bold text-center lg:text-xl text-sky-500">
        {formatCurrencyVND(overview?.discountCommission || 0)}
      </p>
    </div>
  );
};

export default AccumulatedCommissions;
