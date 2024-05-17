import { ChevronDownIcon } from '@heroicons/react/outline';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EKeyFilter, EStatus } from '@common/enum';
import { formatCurrencyVND } from '@common/functions';

import Pagination from '@components/Pagination';
import { Search, IOption } from '@components/Search';

import { DEFAULT_LIMIT } from '@constants/app';
import { IStatus, statusOrders } from '@constants/status';

import useAuth from '@hooks/useAuth';

import { getOrderList } from '@redux/actions/admin/order';

import { getOrderSearchService } from '@services/admin/order';

import { IGetListWithKeyValue, IResponse, IRootState } from '@typings';

interface IOrderAdminProps {}
const options: IOption[] = [
  {
    label: 'Email',
    value: EKeyFilter.EMAIL,
  },
  {
    label: 'Số điện thoại',
    value: EKeyFilter.PHONE_NUMBER,
  },
  {
    label: 'Mã đơn hàng',
    value: EKeyFilter.ORDER_ID,
  },
];
interface IFilter {
  key: string;
  value: string;
}
export const OrderAdmin: React.FC<IOrderAdminProps> = (props) => {
  const dispatch = useDispatch();
  const { order } = useSelector((state: IRootState) => state.order);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<IFilter | null>(null);

  useEffect(() => {
    getOrderListAPI(0);
  }, []);

  const getOrderListAPI = (page: number, key?: string, value?: string) => {
    const payload: IGetListWithKeyValue = {
      key,
      value,
      limit: DEFAULT_LIMIT,
      offset: DEFAULT_LIMIT * page,
    };
    if (!key && !value) {
      delete payload.key;
      delete payload.value;
    }
    dispatch(getOrderList(payload));
  };
  const handleSelectFilter = (key: string, value: string) => {
    getOrderListAPI(0, key, value);
    setPage(1);
  };
  const handleFetchAPI = async (key: string, value: string) => {
    setFilter({ key, value });
    const response = await getOrderSearchService({ key, value });
    const { data } = response;
    return data as string[];
  };

  const renderStatus = (statusOrder: EStatus) => {
    const status = statusOrders?.find((item) => item.value === statusOrder);

    if (status) {
      let color = '';
      let bg = '';
      switch (status?.value) {
        case EStatus.CANCEL:
          bg = 'bg-red-200';
          color = 'text-red-800';
          break;
        case EStatus.FAILURE:
          bg = 'bg-red-200';
          color = 'text-red-800';
          break;
        case EStatus.PENDING:
          bg = 'bg-yellow-200';
          color = 'text-yellow-800';
          break;
        case EStatus.SUCCESS:
          bg = 'bg-green-200';
          color = 'text-green-800';
          break;
      }
      return { status, color, bg };
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    getOrderListAPI(newPage - 1, filter?.key, filter?.value);
  };

  return (
    <div className="p-4 bg-white sm:px-6 lg:p-8 ">
      <Search
        onFetchAPI={handleFetchAPI}
        onSelect={handleSelectFilter}
        options={options}
      />
      <div className="flex flex-col mt-8">
        <div className="px-2 -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                      #
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 text-left text-sm font-semibold text-gray-900 sm:px-6`}>
                      Email
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                      SĐT
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                      OrderId
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 min-w-[140px] text-left px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                      Sản phẩm
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                      Gói
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 min-w-[130px] px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                      Thời gian
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                      Coupon
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 min-w-[130px] px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                      Code người hỗ trợ
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 min-w-[140px] text-right px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                      Số tiền
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 min-w-[140px] text-sm font-semibold text-gray-900 sm:px-6`}>
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 min-w-[140px] text-sm font-semibold text-gray-900 sm:px-6`}>
                      Thời gian tạo đơn
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order?.items?.length > 0 ? (
                    order?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                          {index + 1 + DEFAULT_LIMIT * (page - 1)}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap sm:px-6">
                          {item.user?.email}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                          {item.user?.phoneNumber || '--'}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap sm:px-6">
                          {item.orderId}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap sm:px-6">
                          {item.service.name}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                          {item.package?.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-500 whitespace-nowrap sm:px-6">
                          {item.numberOfMonths}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-500 whitespace-nowrap sm:px-6">
                          {item.couponCode || '--'}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-500 whitespace-nowrap sm:px-6">
                          {item.referrerCode || '--'}
                        </td>
                        <td className="relative px-4 py-4 text-sm font-medium text-right whitespace-nowrap sm:px-6">
                          {formatCurrencyVND(item.amount)}
                        </td>
                        <td className="relative px-4 py-4 text-sm font-medium text-center whitespace-nowrap sm:px-6">
                          <span
                            className={`inline-flex items-center rounded-full  px-2.5 py-0.5 text-sm font-medium ${
                              renderStatus(item?.status)?.bg
                            } ${renderStatus(item?.status)?.color}`}>
                            {renderStatus(item?.status)?.status?.name}
                          </span>
                        </td>
                        <td className="relative px-4 py-4 text-sm font-medium text-right whitespace-nowrap sm:px-6">
                          <span>
                            {DateTime.fromISO(
                              item.created_at.toString()
                            ).toFormat('HH:mm dd/MM/yyyy')}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap"
                        align="center"
                        colSpan={12}>
                        Không có đơn hàng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {order?.total < DEFAULT_LIMIT ? null : (
        <Pagination
          limit={DEFAULT_LIMIT}
          total={order?.total}
          page={page}
          onCallBack={handleChangePage}
        />
      )}
    </div>
  );
};
export default OrderAdmin;
