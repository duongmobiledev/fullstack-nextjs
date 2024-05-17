import { EStatus } from '@common/enum';

export interface IStatus {
  name: string;
  value: EStatus;
}
export const statusOrders: IStatus[] = [
  {
    name: 'Thành công',
    value: EStatus.SUCCESS,
  },
  {
    name: 'Đã hủy',
    value: EStatus.CANCEL,
  },
  {
    name: 'Đang xử lý',
    value: EStatus.PENDING,
  },
  {
    name: 'Thất bại',
    value: EStatus.FAILURE,
  },
];
