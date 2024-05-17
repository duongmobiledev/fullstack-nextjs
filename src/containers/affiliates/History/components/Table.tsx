import { DateTime } from 'luxon';
import { useState } from 'react';

import { formatCurrencyVND } from '@common/functions';

import Button from '@designs/Button';

import { IHistoryWithDraw } from '@typings';

import ModalHistory from './ModalHistory';

export enum IWithdrawalStatus {
  PROCESSING = 'processing',
  DONE = 'done',
  FAIL = 'failed',
}
interface ITableProps {
  items: IHistoryWithDraw[];
}
const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Table: React.FC<ITableProps> = ({ items }: ITableProps) => {
  const [isOpen, setIOpen] = useState<boolean>(false);
  const [Obj, setObj] = useState<IHistoryWithDraw>();
  const onOpenDialog = (obj: IHistoryWithDraw) => () => {
    setObj(obj);
    setIOpen(true);
  };
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {items?.length > 0 ? (
        items?.map((item, index) => (
          <tr key={index.toString()}>
            <td
              className={classNames(
                index === 0 ? '' : 'border-t border-gray-200',
                ' px-3 py-3.5 text-sm text-gray-500 '
              )}>
              {index + 1}
            </td>
            <td
              className={classNames(
                index === 0 ? '' : 'border-t border-gray-200',
                ' px-3 py-3.5 text-sm text-gray-500 max-w-'
              )}>
              {item?._id}
            </td>
            <td
              className={classNames(
                index === 0 ? '' : 'border-t border-gray-200',
                ' px-3 py-3.5 text-sm text-gray-500 '
              )}>
              {DateTime.fromISO(item?.created_at).toFormat('HH:mm dd/MM/yyyy')}
            </td>
            <td
              className={classNames(
                index === 0 ? '' : 'border-t border-gray-200 ',
                ' px-3 w-56 py-3.5 text-center  text-sm text-gray-500 lg:table-cell '
              )}>
              <div className="flex justify-center">
                <Button
                  label={'Xem'}
                  onClick={onOpenDialog(item)}
                  className={classNames(
                    ' px-3 w-24 py-3.5 text-sm text-gray-500 lg:table-cell '
                  )}></Button>
              </div>
            </td>
            <td
              className={classNames(
                index === 0 ? '' : 'border-t border-gray-200',
                ' px-3 py-3.5 text-sm text-right text-gray-500 lg:table-cell'
              )}>
              {formatCurrencyVND(item.amount)}
            </td>
            <td
              className={classNames(
                index === 0 ? '' : 'border-t border-gray-200',
                'px-3 py-3.5 text-sm text-gray-500'
              )}>
              <div
                className={classNames(
                  item?.status == IWithdrawalStatus.PROCESSING
                    ? ' bg-yellow-100 text-yellow-500		'
                    : item?.status == IWithdrawalStatus.DONE
                    ? 'bg-green-200	 text-green-600'
                    : 'bg-rose-500 text-rose-600',
                  ' sm:block rounded-lg text-center font-bold	'
                )}>
                {item?.status == IWithdrawalStatus.PROCESSING
                  ? 'Đang xử lí'
                  : item?.status == IWithdrawalStatus.DONE
                  ? 'Hoàn thành'
                  : 'Hủy bỏ'}
              </div>
            </td>
          </tr>
        ))
      ) : (
        <td
          colSpan={6}
          className="py-4 pl-4 pr-3 w-full text-xs italic text-center">
          Không có dữ liệu
        </td>
      )}

      <ModalHistory
        isOpen={isOpen}
        onClose={() => {
          setIOpen(false);
        }}
        obj={Obj}
      />
    </tbody>
  );
};
export default Table;
