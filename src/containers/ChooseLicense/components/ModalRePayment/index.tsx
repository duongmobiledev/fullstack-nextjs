import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import {
  formatCurrencyVND,
  calcPackageWithCoupon,
  calcPackage,
} from '@common/functions';

import Dialog from '@components/DialogNoButton';

import { months } from '@constants/month';
import { PRICE_SUPPORT } from '@constants/payment';

import Button from '@designs/Button';
import CheckboxCpn from '@designs/Checkbox';
import Input from '@designs/Input';
import Select from '@designs/Select';

import { checkCouponPromotion, resetCoupon } from '@redux/actions/coupon';
import { payment, paymentAgain } from '@redux/actions/license';

import {
  ICoupon,
  IInvoice,
  IMonthPackage,
  IPackage,
  IPayment,
  IRootState,
} from '@typings';

interface IModalDetailProps {
  onClose: () => void;
  invoice: IInvoice | null;
  orderID: string;
}
interface IFormData {
  month?: string;
  coupon?: string;
  ref?: number;
}
const ModalDetail: React.FC<IModalDetailProps> = (props) => {
  const { onClose, invoice, orderID } = props;
  const { couponResult, loadingCheck } = useSelector(
    (state: IRootState) => state.coupon
  );
  const { dataServiceDetail } = useSelector(
    (state: IRootState) => state.services
  );
  const { register, handleSubmit, setValue } = useForm<IFormData>({});
  const [month, setMonth] = useState<IMonthPackage | null>(months[0]);
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (invoice !== null) {
      setChecked(invoice?.isSupport1v1);
    }
  }, [invoice]);

  const onSubmit = (data: IFormData) => {
    dispatch(paymentAgain({ orderId: orderID }));
  };

  const handleCheckSupport = () => {};

  const handleSelectMonth = (value: IMonthPackage) => setMonth(value);

  const renderDiscount = () => {
    const type = couponResult?.coupon?.value?.discountBy;
    const priceCoupon =
      type === 'percent'
        ? couponResult?.coupon?.value?.percent
        : couponResult?.coupon?.value?.price;

    const calcTotal =
      calcPackageWithCoupon(
        month?.month,
        invoice?.package?.price,
        type,
        priceCoupon
      ) || 0;

    const totalDefault = invoice?.package?.price * month?.month;

    //só tiền giảm với mã km
    const total = totalDefault - calcTotal;
    return total;
  };

  const handleClose = () => {
    onClose();
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
      open={invoice !== null}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2">
        <div className="grid items-center min-h-[40px] grid-cols-2 gap-2">
          <p className="text-left">Gói cước</p>
          <p className="text-right">{invoice?.package?.name}</p>
        </div>
        <div className="grid items-center min-h-[40px] grid-cols-2 gap-2">
          <p className="text-left">Price/tháng</p>
          <p className="text-right">
            {formatCurrencyVND(invoice?.package?.price || 0)}
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
                disabled
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
              disabled
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
            <Input
              disabled
              register={register}
              name="coupon"
              placeholder="Nhập mã giảm giá"
              required={false}
            />
          </div>
        </div>
        <div className="grid items-center min-h-[40px] grid-cols-2 gap-2">
          <p className="text-left">Mã người hỗ trợ</p>
          <div className="relative">
            <Input
              disabled
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
          {formatCurrencyVND(invoice?.amount)}
        </div>
        <div className="flex items-center justify-end min-h-[40px] gap-2 ">
          <Button
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
