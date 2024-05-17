import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import {
  formatCurrencyVND,
  calcUpgradePackage,
  calcUpgradeWithCoupon,
  calcPackage,
} from '@common/functions';

import Dialog from '@components/DialogNoButton';
import Spinner from '@components/Spinner';

import { PRICE_SUPPORT } from '@constants/payment';

import Button from '@designs/Button';
import CheckboxCpn from '@designs/Checkbox';
import Input from '@designs/Input';

import { checkCouponPromotion, resetCoupon } from '@redux/actions/coupon';
import { payment } from '@redux/actions/license';

import { IMonthPackage, IPayment, IRootState } from '@typings';

interface IModalDetailProps {
  onClose: () => void;
  packageRegister: IMonthPackage;
  open: boolean;
}
interface IFormData {
  month?: string;
  coupon?: string;
  ref?: number;
}
const ModalDetail: React.FC<IModalDetailProps> = (props) => {
  const { onClose, packageRegister, open } = props;
  const { couponResult, loadingCheck } = useSelector(
    (state: IRootState) => state.coupon
  );
  const { coupon } = couponResult || {};
  const { dataServiceDetail } = useSelector(
    (state: IRootState) => state.services
  );
  const { loadingPayment } = useSelector((state: IRootState) => state.license);
  const { license } = dataServiceDetail || {};
  const { register, handleSubmit, setValue } = useForm<IFormData>({});
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const { idDetailService } = useRouter().query;

  const onSubmit = (data: IFormData) => {
    const payload: IPayment = {
      amount: checked
        ? renderPriceUpgrade() + PRICE_SUPPORT
        : renderPriceUpgrade(),
      couponCode: data?.coupon,
      isSupport1v1: !license?.isSupport1v1 ? checked : license?.isSupport1v1,
      numberOfMonths: packageRegister?.month,
      packageId: packageRegister?.id_package,
      serviceId: idDetailService as string,
      isUpgrade: true,
      numberOfMonthsUpgrade: packageRegister?.month - license?.numberOfMonths,
      userRefCode: data?.ref,
    };
    !data?.coupon && delete payload.couponCode;
    dispatch(payment(payload));
  };

  const handleCheckSupport = () => {
    setChecked(!checked);
  };
  const handleChangeValueCoupon = (event: ChangeEvent<any>) => {
    const value = event.target.value;
    debounceCoupon(value);
  };
  const debounceCoupon = debounce(
    useCallback((value: string) => {
      if (value === '' || !value) {
        dispatch(resetCoupon());
        return;
      }
      dispatch(
        checkCouponPromotion({
          code: value,
          serviceId: idDetailService as string,
        })
      );
    }, []),
    700
  );

  const renderPriceUpgrade = () => {
    const priceCoupon =
      coupon?.value.discountBy === 'percent'
        ? coupon?.value.percent
        : coupon?.value.price;

    const oldPrice = calcPackage(
      license?.numberOfMonths,
      license?.package.price
    );
    const total = calcUpgradePackage(
      oldPrice,
      packageRegister?.month,
      packageRegister?.price
    );
    return calcUpgradeWithCoupon(total, coupon?.value.discountBy, priceCoupon);
  };

  const renderDiscount = () => {
    // old 20 //default 100
    const init = packageRegister?.month * packageRegister?.price;

    const calcNewPackage = calcPackage(
      packageRegister?.month,
      packageRegister?.price
    );

    const priceCoupon =
      coupon?.value.discountBy === 'percent'
        ? coupon?.value.percent
        : coupon?.value.price;

    //giam 50k => 65k - 50k = 15k
    const totalApplyCoupon = calcUpgradeWithCoupon(
      calcNewPackage,
      coupon?.value.discountBy,
      priceCoupon
    );
    //65 - 15
    let discountCoupon = init - totalApplyCoupon;
    return discountCoupon;
  };
  const renderResultCoupon = () => {
    if (coupon === null) {
      return 'Mã không khả dụng';
    } else {
      if (coupon?.value?.discountBy === 'percent') {
        return `Mã khuyến mãi giảm ${coupon?.value?.percent}%`;
      } else {
        return `Mã khuyến mãi giảm ${formatCurrencyVND(
          coupon?.value?.price || 0
        )}`;
      }
    }
  };
  const handleClose = () => {
    onClose();
    setValue('coupon', '');
    dispatch(resetCoupon());
  };

  return (
    <Dialog title="Chi tiết gói cước" onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="grid items-center grid-cols-2 gap-2 min-h-[40px]">
          <p className="text-left">Gói cước hiện tại</p>
          <p className="text-right">
            {license?.package?.name}, {license?.numberOfMonths} Tháng{' '}
          </p>
        </div>
        <div className="grid items-center grid-cols-2 gap-2 min-h-[40px]">
          <p className="text-left">Gói cước sau nâng cấp</p>
          <p className="text-right">
            {packageRegister?.name}, {packageRegister?.month} Tháng{' '}
          </p>
        </div>
        {!license?.isSupport1v1 ? (
          <div className="grid items-center grid-cols-2 gap-2 min-h-[40px]">
            <p className="text-left">Support 1-1</p>
            <div className="flex justify-end">
              <CheckboxCpn
                label={PRICE_SUPPORT.toString()}
                initChecked={checked}
                onChecked={handleCheckSupport}
              />
            </div>
          </div>
        ) : (
          <div className="grid items-center grid-cols-2 gap-2 min-h-[40px]">
            <p className="text-left">Support 1-1</p>
            <p className="text-right">{formatCurrencyVND(PRICE_SUPPORT)}</p>
          </div>
        )}
        <div className="grid items-center grid-cols-2 gap-2 min-h-[40px]">
          <p className="text-left">Coupon</p>
          <div className="relative">
            <div className="absolute -translate-y-1/2 left-full top-1/2">
              {loadingCheck && <Spinner />}
            </div>
            <Input
              register={register}
              name="coupon"
              placeholder="Nhập mã giảm giá"
              required={false}
              onChange={handleChangeValueCoupon}
            />
            {couponResult !== null && (
              <p
                className={`text-sm text-right ${
                  couponResult === null ? 'text-red-500' : 'text-cyan-500'
                }`}>
                {renderResultCoupon()}
              </p>
            )}
          </div>
        </div>
        <div className="grid items-center grid-cols-2 gap-2 min-h-[40px]">
          <p className="text-left">Mã người hỗ trợ</p>
          <div className="relative">
            <Input
              register={register}
              name="ref"
              placeholder="Nhập mã"
              required={false}
            />
          </div>
        </div>
        <div className="border-t border-gray-400 border-solid" />
        {renderDiscount() !== 0 && (
          <div className="min-h-[40px] text-xl font-bold text-right text-red-500  ">
            -{formatCurrencyVND(renderDiscount() || 0)}
          </div>
        )}
        <div className="text-3xl min-h-[40px] font-bold text-right text-cyan-500">
          {checked
            ? formatCurrencyVND(renderPriceUpgrade() + PRICE_SUPPORT)
            : formatCurrencyVND(renderPriceUpgrade() || 0)}
        </div>
        <div className="flex min-h-[40px] items-center justify-end gap-2 ">
          <Button
            disabled={loadingCheck}
            type="button"
            variant="secondary"
            label="Hủy"
            onClick={handleClose}
          />
          <Button type="submit" label="Thanh toán" />
        </div>
      </form>
    </Dialog>
  );
};

export default ModalDetail;
