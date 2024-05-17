import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import Spinner from '@components/Spinner';

import { IRootState } from '@redux/reducers';

import {
  CouponProduct,
  DescriptionProduct,
  ImageProduct,
  LicenseProduct,
  PayProduct,
} from './components';

interface IProductInformationProps {}

const ProductInformation: React.FC<IProductInformationProps> = (props) => {
  const state = useSelector((state: IRootState) => state.services);
  const router = useRouter();

  return (
    <>
      {state.dataServiceDetail != null ? (
        <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          <ImageProduct product={state.dataServiceDetail} />
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3">
            <DescriptionProduct item={state.dataServiceDetail} />
            <PayProduct product={state.dataServiceDetail} />
            {state.dataServiceDetail?.license != null ? (
              <LicenseProduct product={state.dataServiceDetail} />
            ) : (
              <div />
            )}
            <CouponProduct product={state.dataServiceDetail} />
          </div>
        </div>
      ) : (
        <div />
      )}
    </>
  );
};

export default ProductInformation;
