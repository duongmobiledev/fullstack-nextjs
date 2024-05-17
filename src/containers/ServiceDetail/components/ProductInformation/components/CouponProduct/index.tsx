import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@designs/Button';

import { setNotify } from '@redux/actions/common';
import {
  applyIsRenewalCouponAction,
  loadDataDetailServices,
} from '@redux/actions/services';

import { IRootState, IService } from '@typings';

interface ICouponProductProps {
  product: IService;
}

const CouponProduct: React.FC<ICouponProductProps> = (props) => {
  const state = useSelector((state: IRootState) => state.services);
  const [isShown, setIsShown] = useState<boolean>(false);
  const dispatch = useDispatch();
  const onCheckCouponRenewal = (event) => {
    event.preventDefault();
    dispatch(
      applyIsRenewalCouponAction({
        code: event.target.couponCode.value,
        serviceId: props.product?._id,
      })
    );
  };
  useEffect(() => {
    if (state.checkCouponRenewalSuccess) {
      dispatch(
        loadDataDetailServices({ id: state?.dataServiceDetail?._id as string })
      );
    }
  }, [state.checkCouponRenewalSuccess]);
  return (
    <>
      <div className="pt-5 mt-2 border-t border-gray-200">
        <h3 className="text-lg font-medium 	color: rgb(0 0 0) font-weight: 600">
          Coupon
        </h3>
        <form className="flex flex-col gap-2" onSubmit={onCheckCouponRenewal}>
          <input
            id="couponCode"
            name="couponCode"
            required
            onChange={(e) => {
              if (e != null) {
                setIsShown(true);
              }
            }}
            autoComplete="off"
            placeholder={'Nhập mã'}
            className={`block w-auto appearance-none px-3 py-2 border border-gray-300 border-solid rounded-md shadow-sm disabled:bg-gray-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              state.errorCoupon && 'border-red-500 focus:border-red-500'
            }`}
          />
          {state.errorCoupon && (
            <h3 className="text-sm font-medium text-red-700">
              Mã không khả dụng
            </h3>
          )}
          {state.checkCouponRenewalSuccess && (
            <h3 className="text-sm font-medium text-green-700">
              Mã phiếu giảm giá của bạn chính xác!
            </h3>
          )}
          <Button
            loading={state.loadingCoupon}
            disabled={!isShown}
            label="Xác Nhận"
            type="submit"></Button>
        </form>
      </div>
    </>
  );
};

export default CouponProduct;
