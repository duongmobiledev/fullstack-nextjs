import { ICouponList } from 'src/typings/Admin/Coupon';

import Dialog from '@components/Dialog';

import Button from '@designs/Button';

interface ModalCouponRenewalProps {
  isOpen: boolean;
  onClose: () => void;
  obj: ICouponList;
}
export const ModalCouponRenewal = (props: ModalCouponRenewalProps) => {
  const { onClose, isOpen, obj } = props;
  return (
    <Dialog onClose={onClose} open={isOpen} title="Nội dung coupon bản quyền">
      <div className="flex flex-col gap-2">
        {obj?.services?.map((e, index) => (
          <div className="grid items-center gap-2 mt-6 md:grid-cols-2 sm:grid-row-2">
            <p className="text-left">Sản phẩm áp dụng:</p>
            <p className="text-left">{e?.name}</p>
          </div>
        ))}
        <div className="grid items-center gap-2 mt-6 md:grid-cols-2 sm:grid-row-2">
          <p className="text-left">Gói:</p>
          <p className="text-left">{`${obj?.value?.package?.name}`}</p>
        </div>
        <div className="grid items-center gap-2 mt-6 md:grid-cols-2 sm:grid-row-2">
          <p className="text-left">Số ngày bản quyền:</p>
          <p className="text-left">{`${obj?.value?.dailyLimit}`}</p>
        </div>
        <div className="grid items-center gap-2 mt-6 md:grid-cols-2 sm:grid-row-2">
          <p className="text-left">Giới hạn bản quyền:</p>
          <p className="text-left">{`${
            obj?.value?.extraTimestamp / 24 / 60 / 60
          }`}</p>
        </div>
        <div className="flex justify-end w-full">
          <Button onClick={onClose} className="w-20 mt-8" label="Đóng"></Button>
        </div>
      </div>
    </Dialog>
  );
};
