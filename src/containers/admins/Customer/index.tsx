import { ChevronDownIcon } from '@heroicons/react/outline';
import { ViewIcon } from '@icons';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EKeyFilter, EStatus } from '@common/enum';
import { formatCurrencyVND } from '@common/functions';

import Pagination from '@components/Pagination';
import { Search, IOption } from '@components/Search';

import { DEFAULT_LIMIT } from '@constants/app';
import { IStatus, statusOrders } from '@constants/status';

import Button from '@designs/Button';

import useAuth from '@hooks/useAuth';

import { getCustomerList } from '@redux/actions/admin';

import { getCustomerSearchService } from '@services/admin/customer';

import {
  IGetListWithKeyValue,
  IResponse,
  IRootState,
  ICustomer,
} from '@typings';

import ModalEditCustomer from './ModalEdit';
import ModalLicense from './ModalLicense';

interface ICustomerAdminProps {}
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
    label: 'Tên khách hàng',
    value: EKeyFilter.NAME,
  },
  {
    label: 'Mã khách hàng',
    value: EKeyFilter.ID,
  },
  {
    label: 'Người giới thiệu',
    value: EKeyFilter.REFERER,
  },
];

interface IFilter {
  key: string;
  value: string;
}
type TypeAction = 'VIEW' | 'EDIT';
interface IAction {
  name: TypeAction;
  data: ICustomer | null;
}
export const CustomerAdmin: React.FC<ICustomerAdminProps> = (props) => {
  const dispatch = useDispatch();
  const { customer } = useSelector((state: IRootState) => state.customer);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<IFilter | null>(null);
  const [openModal, setOpenModal] = useState<IAction | null>(null);
  const { actionSuccess } = useSelector((state: IRootState) => state.common);

  useEffect(() => {
    if (actionSuccess) {
      getCustomerListAPI(0, filter?.key, filter?.value);
    }
  }, [actionSuccess]);

  useEffect(() => {
    getCustomerListAPI(0);
  }, []);

  const getCustomerListAPI = (page: number, key?: string, value?: string) => {
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
    dispatch(getCustomerList(payload));
  };
  const handleSelectFilter = (key: string, value: string) => {
    getCustomerListAPI(0, key, value);
    setPage(1);
  };
  const handleFetchAPI = async (key: string, value: string) => {
    setFilter({ key, value });
    const response = await getCustomerSearchService({ key, value });
    const { data } = response;
    return data as string[];
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    getCustomerListAPI(newPage - 1, filter?.key, filter?.value);
  };
  const handleOpenViewLicense = (item: ICustomer) => () =>
    setOpenModal({
      data: item,
      name: 'VIEW',
    });
  const handleOpenEdit = (item: ICustomer) => () =>
    setOpenModal({
      data: item,
      name: 'EDIT',
    });
  return (
    <>
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
                        className={`py-3.5 px-4 text-left min-w-[140px] text-sm font-semibold text-gray-900 sm:px-6`}>
                        Tên KH
                      </th>

                      <th
                        scope="col"
                        className={`py-3.5 px-4 text-left text-sm font-semibold text-gray-900 sm:px-6`}>
                        ID
                      </th>
                      <th
                        scope="col"
                        className={`py-3.5 px-4 text-left text-sm font-semibold text-gray-900 sm:px-6`}>
                        Referrer
                      </th>
                      <th
                        scope="col"
                        className={`py-3.5 min-w-[140px] text-center px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                        SĐT
                      </th>
                      <th
                        scope="col"
                        className={`py-3.5 px-4 min-w-[150px] text-sm text-center font-semibold text-gray-900 sm:px-6`}>
                        Ngày đăng ký
                      </th>
                      <th
                        scope="col"
                        className={`py-3.5 min-w-[130px] text-center px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                        Bản quyền
                      </th>
                      <th
                        scope="col"
                        className={`py-3.5 px-4 min-w-[130px] text-sm text-right font-semibold text-gray-900 sm:px-6`}>
                        Balance
                      </th>
                      <th
                        scope="col"
                        className={`py-3.5 min-w-[130px] text-center px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                        Chiêt khấu
                      </th>
                      <th
                        scope="col"
                        className={`py-3.5 min-w-[140px] text-center px-4 text-sm font-semibold text-gray-900 sm:px-6`}>
                        SL ref
                      </th>
                      <th
                        scope="col"
                        className={`py-3.5 px-4 min-w-[140px] text-sm text-center font-semibold text-gray-900 sm:px-6`}>
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customer?.items?.length > 0 ? (
                      customer?.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                            {index + 1 + DEFAULT_LIMIT * (page - 1)}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap sm:px-6">
                            {item?.user?.email}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-left text-gray-900 whitespace-nowrap sm:px-6">
                            {item?.user.displayName || '--'}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-left text-gray-900 whitespace-nowrap sm:px-6">
                            {item?.user.accountId}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-left text-gray-900 whitespace-nowrap sm:px-6">
                            {item?.user?.referrer || '--'}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                            {item?.user.phoneNumber || '--'}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                            {DateTime.fromISO(
                              item?.user.created_at?.toString()
                            ).toFormat('HH:mm dd/MM/yyyy')}
                          </td>
                          <td className="px-4 py-4 text-sm text-center text-gray-500 whitespace-nowrap sm:px-6">
                            <button
                              onClick={handleOpenViewLicense(item)}
                              className="flex items-center w-full gap-1 px-6 py-2 text-sm font-medium text-white bg-green-600 border border-gray-300 border-solid rounded-md shadow-sm disabled:bg-opacity-60 disabled:cursor-not-allowed hover:bg-green-700 focus:outline-none ">
                              <ViewIcon width={20} height={20} /> Xem
                            </button>
                          </td>
                          <td className="px-4 py-4 text-sm text-right text-gray-500 whitespace-nowrap sm:px-6">
                            {formatCurrencyVND(item.balance)}
                          </td>
                          <td className="px-4 py-4 text-sm text-center text-gray-500 whitespace-nowrap sm:px-6">
                            {item.discount * 100}%
                          </td>
                          <td className="relative px-4 py-4 text-sm font-medium text-center whitespace-nowrap sm:px-6">
                            {item.refCount}
                          </td>
                          <td className="relative px-4 py-4 text-sm font-medium text-center whitespace-nowrap sm:px-6">
                            <Button
                              onClick={handleOpenEdit(item)}
                              label="Chỉnh sửa"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap"
                          align="center"
                          colSpan={12}>
                          Không có khách hàng
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {customer?.total < DEFAULT_LIMIT ? null : (
          <Pagination
            limit={DEFAULT_LIMIT}
            total={customer?.total}
            page={page}
            onCallBack={handleChangePage}
          />
        )}
      </div>
      <ModalLicense
        data={openModal?.data}
        open={openModal?.name === 'VIEW'}
        onClose={() => setOpenModal(null)}
      />
      <ModalEditCustomer
        data={openModal?.data}
        open={openModal?.name === 'EDIT'}
        onClose={() => setOpenModal(null)}
      />
    </>
  );
};
export default CustomerAdmin;
