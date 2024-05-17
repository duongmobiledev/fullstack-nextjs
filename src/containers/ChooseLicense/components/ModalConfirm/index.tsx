import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import {
  formatCurrencyVND,
  calcPackageWithCoupon,
  calcPackage,
} from '@common/functions';

import Dialog from '@components/DialogNoButton';
import Spinner from '@components/Spinner';

import { months } from '@constants/month';
import { PRICE_SUPPORT } from '@constants/payment';

import Button from '@designs/Button';
import CheckboxCpn from '@designs/Checkbox';
import Input from '@designs/Input';
import Select from '@designs/Select';

import { checkCouponPromotion, resetCoupon } from '@redux/actions/coupon';
import { payment } from '@redux/actions/license';

import {
  ICoupon,
  IMonthPackage,
  IPackage,
  IPayment,
  IRootState,
} from '@typings';

interface IModalDetailProps {
  onClose: () => void;
  packageRegister: IPackage | null;
  isSupport: boolean;
}
interface IFormData {
  month?: string;
  coupon?: string;
  ref?: number;
}
const ModalDetail: React.FC<IModalDetailProps> = (props) => {
  const { onClose, packageRegister, isSupport } = props;
  const { couponResult, loadingCheck } = useSelector(
    (state: IRootState) => state.coupon
  );
  const { dataServiceDetail } = useSelector(
    (state: IRootState) => state.services
  );
  const { loadingPayment } = useSelector((state: IRootState) => state.license);
  const { register, handleSubmit, setValue } = useForm<IFormData>({});
  const [month, setMonth] = useState<IMonthPackage | null>(months[0]);
  const [checked, setChecked] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const dispatch = useDispatch();
  const { idDetailService } = useRouter().query;

  useEffect(() => {
    if (packageRegister !== null) {
      setChecked(isSupport);
    }
  }, [packageRegister]);

  const onSubmit = (data: IFormData) => {
    const payload: IPayment = {
      amount: checked ? renderPrice() + PRICE_SUPPORT : renderPrice(),
      couponCode: data?.coupon,
      isSupport1v1: checked,
      numberOfMonths: month?.month,
      packageId: packageRegister?._id,
      serviceId: idDetailService as string,
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
    400
  );
  const handleSelectMonth = (value: IMonthPackage) => setMonth(value);

  const renderPrice = () => {
    const type = couponResult?.coupon?.value?.discountBy;
    const priceCoupon =
      type === 'percent'
        ? couponResult?.coupon?.value?.percent
        : couponResult?.coupon?.value?.price;

    const price =
      calcPackageWithCoupon(
        month?.month,
        packageRegister?.price,
        type,
        priceCoupon
      ) || 0;
    return price;
  };

  const renderDiscount = () => {
    const type = couponResult?.coupon?.value?.discountBy;
    const priceCoupon =
      type === 'percent'
        ? couponResult?.coupon?.value?.percent
        : couponResult?.coupon?.value?.price;

    const calcTotal =
      calcPackageWithCoupon(
        month?.month,
        packageRegister?.price,
        type,
        priceCoupon
      ) || 0;

    const totalDefault = packageRegister?.price * month?.month;

    //só tiền giảm với mã km
    const total = totalDefault - calcTotal;
    return total;
  };
  const renderResultCoupon = () => {
    if (couponResult?.coupon === null) {
      return 'Mã không khả dụng';
    } else {
      if (couponResult?.coupon?.value?.discountBy === 'percent') {
        return `Mã khuyến mãi giảm ${couponResult?.coupon?.value?.percent}%`;
      } else {
        return `Mã khuyến mãi giảm ${formatCurrencyVND(
          couponResult?.coupon?.value?.price || 0
        )}`;
      }
    }
  };
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setChecked(isSupport);
      setValue('coupon', '');
      dispatch(resetCoupon());
    }, 3000);
  };
  const formatMonths = months.map((item) => {
    if (item?.discount) {
      return { ...item, text: item?.text + ` (- ${item.discount}%)` };
    } else {
      return item?.text;
    }
  });
  return (
    <Dialog
      title="Chi tiết gói cước"
      onClose={handleClose}
      open={packageRegister !== null}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2">
        <div className="grid items-center min-h-[40px] grid-cols-2 gap-2">
          <p className="text-left">Gói cước</p>
          <p className="text-right">{packageRegister?.name}</p>
        </div>
        <div className="grid items-center min-h-[40px] grid-cols-2 gap-2">
          <p className="text-left">Price/tháng</p>
          <p className="text-right">
            {formatCurrencyVND(packageRegister?.price || 0)}
          </p>
        </div>
        {dataServiceDetail !== null &&
        dataServiceDetail?.license?.isSupport1v1 ? (
          <div className="grid items-center min-h-[40px] grid-cols-2 gap-2">
            <p className="text-left">Support 1-1</p>
            <p className="text-right">{formatCurrencyVND(PRICE_SUPPORT)}</p>
          </div>
        ) : (
          <div className="grid items-center min-h-[40px] grid-cols-2 gap-2">
            <p className="text-left">Support 1-1</p>
            <div className="flex justify-end">
              <CheckboxCpn
                label={formatCurrencyVND(PRICE_SUPPORT)}
                initChecked={checked}
                onChecked={handleCheckSupport}
              />
            </div>
          </div>
        )}
        <div className="grid items-center min-h-[40px] grid-cols-2 gap-2">
          <p className="text-left">Thời gian</p>
          <div className="">
            <Select
              label=""
              optionTarget="text"
              optionSelected={month}
              options={formatMonths}
              className="w-full"
              onSelect={handleSelectMonth}
            />
          </div>
        </div>
        <div className="grid items-center min-h-[40px] grid-cols-2 gap-2">
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
            {couponResult && (
              <p
                className={`text-sm text-right  ${
                  couponResult?.coupon === null
                    ? 'text-red-500'
                    : 'text-cyan-500'
                }`}>
                {renderResultCoupon()}
              </p>
            )}
          </div>
        </div>
        <div className="grid items-center min-h-[40px] grid-cols-2 gap-2">
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
        <div className="min-h-[40px] text-3xl font-bold text-right text-cyan-500">
          {checked
            ? formatCurrencyVND(renderPrice() + PRICE_SUPPORT)
            : formatCurrencyVND(renderPrice() || 0)}
        </div>
        <div className="flex items-center justify-end min-h-[40px] gap-2 ">
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
