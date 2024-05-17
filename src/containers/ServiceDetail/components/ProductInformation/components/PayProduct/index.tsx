import { currency, formatCurrencyVND } from '@common/functions';

import Link from '@designs/Link';

import { PATH } from '@routes';

import { IService } from '@typings';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
interface IPayProductProps {
  product: IService;
}

const PayProduct: React.FC<IPayProductProps> = (props) => {
  const item = props.product;
  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-1">
        <Link
          routeName={PATH.CHOOSE_LICENSE}
          params={{ idDetailService: item?._id }}>
          <button
            type="button"
            className="w-full bg-sky-600 border border-transparent rounded-md py-2 px-5 flex items-center justify-center text-base font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
            Mua {formatCurrencyVND(item?.price ?? 0)}
          </button>
        </Link>
      </div>
    </>
  );
};

export default PayProduct;
