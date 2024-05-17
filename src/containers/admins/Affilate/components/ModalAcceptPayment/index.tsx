import { useState } from 'react';

import Dialog from '@components/Dialog';

import { IWithdrawalStatus } from '@containers/affiliates/History/components/Table';

import Button from '@designs/Button';
import Select from '@designs/Select';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAcpect: (value) => void;
}
const _temp = [
  {
    name: IWithdrawalStatus.PROCESSING,
  },
  { name: IWithdrawalStatus.DONE },
  { name: IWithdrawalStatus.FAIL },
];
export const ModalAcceptPayment = (props: Props) => {
  const { isOpen, onClose, onAcpect } = props;
  const [itemSelected, setItemSelected] = useState(_temp[0]);
  const handleSelected = (option) => {
    setItemSelected(option);
  };

  return (
    <Dialog onClose={onClose} open={isOpen} title="Xác nhận đã thanh toán">
      <div className="flex flex-col gap-1 items-start">
        <p className="text-lg mt-8">
          Thay đổi trạng thái để xác nhận đã thanh toán
        </p>
        <Select
          placeholder="Chọn trạng thái"
          required
          optionTarget="name"
          label=""
          options={_temp}
          optionSelected={itemSelected}
          onSelect={handleSelected}
          className="col-span-8 sm:col-span-2 mt-4 mb-8 w-32"
        />
        <div className=" w-full items-center justify-center flex mt-8">
          <Button
            className="w-28"
            label="Xác nhận"
            onClick={() => {
              onAcpect(itemSelected);
            }}
          />
        </div>
      </div>
    </Dialog>
  );
};
