import { useState } from 'react';

import Dialog from '@components/DialogNoButton';

import Button from '@designs/Button';

import { IHistoryWithDraw } from '@typings';

interface IModalHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  obj?: IHistoryWithDraw;
}
const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
const ModalHistory: React.FC<IModalHistoryProps> = (props) => {
  const { isOpen, obj, onClose } = props;

  return (
    <Dialog onClose={onClose} open={isOpen} title="Thông tin thanh toán">
      <div className="flex flex-col gap-2">
        <div className=" items-center flex-cols flex gap-2 mt-6">
          <p className="text-left text-sm font-bold text-zinc-600	">
            Chủ tài khoản:
          </p>
          <div className="bg-gray-300 flex-1 px-2 py-0.5 rounded-lg	">
            <p className="text-right  text-sm">{obj?.bankAccountName}</p>
          </div>
        </div>
        <div className=" items-center flex-cols flex gap-2 mt-6">
          <p className="text-left text-sm font-bold text-zinc-600	">
            Số tài khoản:
          </p>
          <div className="bg-gray-300 flex-1 px-2 py-0.5 rounded-lg	">
            <p className="text-right text-sm">{obj?.bankAccountNumber}</p>
          </div>
        </div>
        <div className=" items-center flex-cols flex gap-2 mt-6">
          <p className="text-left text-sm font-bold text-zinc-600	">
            Tên ngân hàng:
          </p>
          <div className="bg-gray-300 flex-1 px-2 py-0.5 rounded-lg	">
            <p className="text-right  text-sm">{obj?.bankName}</p>
          </div>
        </div>
        <div className=" items-center flex-cols flex gap-2 mt-6">
          <p className="text-left text-sm font-bold text-zinc-600	">Mail:</p>
          <div className="bg-gray-300 flex-1 px-2 py-0.5 rounded-lg	">
            <p className="text-right  text-sm">{obj?.affiliate?.user?.email}</p>
          </div>
        </div>
        <div className="grid items-center grid-row-2 gap-2 mt-6">
          <p className="text-left text-sm font-bold text-zinc-600	">
            Link FB chính chủ:
          </p>
          <div className="bg-gray-300 flex-1 px-2 py-0.5 rounded-lg	">
            <p className="text-left  text-sm">{obj?.facebookLink}</p>
          </div>
        </div>
        <div className=" w-full items-center mt-6">
          <Button label="Đóng" onClick={onClose} />
        </div>
      </div>
    </Dialog>
  );
};
export default ModalHistory;
