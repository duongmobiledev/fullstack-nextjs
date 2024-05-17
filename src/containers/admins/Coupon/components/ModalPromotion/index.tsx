import { ICouponList } from 'src/typings/Admin/Coupon';

import { formatCurrencyVND } from '@common/functions';

import Dialog from '@components/Dialog';

import Button from '@designs/Button';

import { EPromotionType } from '../context';

interface ModalPromotionProps {
  isOpen: boolean;
  onClose: () => void;
  obj: ICouponList;
}
export const ModalCouponPromotion = (props: ModalPromotionProps) => {
  const { onClose, isOpen, obj } = props;
  return (
    <Dialog onClose={onClose} open={isOpen} title="Nội dung coupon giảm giá">
      <div className="flex flex-col gap-2">
        {obj?.services?.map((e, index) => (
          <div className="grid items-center gap-2 mt-6 md:grid-cols-2 sm:grid-row-2">
            <p className="text-left">Sản phẩm áp dụng:</p>
            <p className="text-left">{e?.name}</p>
          </div>
        ))}
        <div className="grid items-center gap-2 mt-6 md:grid-cols-2 sm:grid-row-2">
          <p className="text-left">Giá trị:</p>
          <p className="text-left">
            {obj?.value?.discountBy == EPromotionType.PERCENT
              ? obj?.value?.percent
              : formatCurrencyVND(obj?.value?.price)}
            {obj?.value?.discountBy == EPromotionType.PERCENT ? '%' : null}
          </p>
        </div>
        <div className="flex justify-end w-full">
          <Button onClick={onClose} className="w-20 mt-8" label="Đóng"></Button>
        </div>
      </div>
    </Dialog>
  );
};
