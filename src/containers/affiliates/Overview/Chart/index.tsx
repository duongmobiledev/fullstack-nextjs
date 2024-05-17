import { DiscountIcon } from '@icons';
import { useSelector } from 'react-redux';

import { IRootState } from '@typings';

interface IChart {}

const Chart: React.FC<IChart> = (props) => {
  const { overview } = useSelector((state: IRootState) => state.affilidate);
  return (
    <div className="h-full px-6 py-4 overflow-hidden bg-white rounded-lg ">
      <h5 className="text-sm font-bold top-2 lg:text-lg">
        Mức chiếc khấu hiện tại
      </h5>
      <div className="flex items-center gap-1 top-8">
        <DiscountIcon width={30} height={30} />
        <span className="text-3xl font-bold text-sky-500">
          {overview?.discount * 100 || 0}%
        </span>
      </div>
      <div className="object-cover w-full ">
        <img src="/svg/chart.svg" />
      </div>
    </div>
  );
};

export default Chart;
