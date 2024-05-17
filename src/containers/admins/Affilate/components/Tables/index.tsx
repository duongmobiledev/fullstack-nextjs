import { Combobox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { ViewIcon } from '@icons';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EKeyFilter } from '@common/enum';
import { formatCurrencyVND } from '@common/functions';

import Pagination from '@components/Pagination';
import { IOption, Search } from '@components/Search';

import { DEFAULT_LIMIT } from '@constants/app';

import { IWithdrawalStatus } from '@containers/affiliates/History/components/Table';

import Button from '@designs/Button';

import {
  changeStatusRequest,
  loadDataAffilateRequest as loadDataAffiliateRequest,
} from '@redux/actions/admin/affilate';

import { getListSearchAffiances } from '@services/admin';

import { IHistoryWithDraw, IRootState } from '@typings';

import { ModalAcceptPayment } from '../ModalAcceptPayment';
import { ModalAffiliate } from '../ModalAffiliate';

const options: IOption[] = [
  {
    label: 'Email',
    value: EKeyFilter.EMAIL,
  },
  {
    label: 'Mã khách hàng',
    value: EKeyFilter.ID,
  },
];

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
export const TablesAffiliates = () => {
  const [isOpenAffiliates, setIsOpenAffiliates] = useState<boolean>(false);
  const [isOpenAccept, setIsOpenAccept] = useState<boolean>(false);

  const state = useSelector((state: IRootState) => state.affialteAdmin);

  const [dataAffilates, setDataAffiliates] = useState<IHistoryWithDraw>();

  const [page, setPage] = useState<number>(1);
  const [keySearch, setKeySearch] = useState<IOption>(options[0]);
  const dispatch = useDispatch();

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    dispatch(
      loadDataAffiliateRequest({
        key: keySearch.label,
        value: keySearch.value,
        limit: DEFAULT_LIMIT,
        offset: (newPage - 1) * DEFAULT_LIMIT,
      })
    );
  };
  const onChangeStatus = (value) => {
    setIsOpenAccept(false);
    dispatch(
      changeStatusRequest({
        status: value.name,
        withdrawalRequestId: dataAffilates?._id,
      })
    );
  };
  useEffect(() => {
    if (state.actionChange) {
      onSelectAffialte();
    }
  }, [state.actionChange]);
  useEffect(() => {
    dispatch(
      loadDataAffiliateRequest({
        key: '',
        value: '',
        limit: DEFAULT_LIMIT,
        offset: 0,
      })
    );
  }, []);

  //
  const onSelectAffialte = () => {
    setPage(1);
    dispatch(
      loadDataAffiliateRequest({
        key: '',
        value: '',
        limit: DEFAULT_LIMIT,
        offset: 0,
      })
    );
  };
  //
  const handleSelectFilter = async (key: string, value: string) => {
    setPage(1);
    setKeySearch({ label: key, value: value });
    dispatch(
      loadDataAffiliateRequest({
        key: key,
        value: value,
        limit: DEFAULT_LIMIT,
        offset: (page - 1) * DEFAULT_LIMIT,
      })
    );
  };

  const handleFetchAPI = async (key: string, value: string) => {
    const response = await getListSearchAffiances({ key, value });
    const { data } = response;
    return data as string[];
  };
  const handleViewStatus = (item) => {
    return (
      <div
        className={classNames(
          item?.status == IWithdrawalStatus.PROCESSING
            ? ' bg-yellow-100 text-yellow-500		'
            : item?.status == IWithdrawalStatus.DONE
            ? 'bg-green-200	 text-green-600'
            : 'bg-rose-300 text-rose-600',
          'hidden sm:block rounded-lg text-center text-sm mt-3 w-24	'
        )}>
        {item?.status == IWithdrawalStatus.PROCESSING
          ? 'Đang xử lí'
          : item?.status == IWithdrawalStatus.DONE
          ? 'Thành công'
          : 'Hủy bỏ'}
      </div>
    );
  };
  return (
    <>
      <div className="l w-full pt-5 md:items-center">
        <Search
          onFetchAPI={handleFetchAPI}
          onSelect={handleSelectFilter}
          options={options}
        />
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left  min-w-[50px] text-sm font-semibold  sm:pl-6">
                      #
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left  min-w-[150px] text-sm font-semibold sm:pl-6">
                      Email
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm  min-w-[250px] font-semibold  sm:pl-6">
                      Thời gian yêu cầu
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[250px] sm:pl-6">
                      Thông tin thanh toán
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[250px] sm:pl-6">
                      Số tiền
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[250px] sm:pl-6">
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[250px] sm:pl-6">
                      Thời gian xác nhận
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white w-96 overflow-x-auto">
                  {state.data?.items?.length > 0 ? (
                    state.data?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 min-w-[50px]  pr-3 text-sm font-medium text-gray-500 sm:pl-6">
                          {index + 1 + (page - 1) * 10}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 min-w-[150px]  text-sm text-gray-500">
                          {item.affiliate?.user?.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm min-w-[150px]  text-gray-500">
                          {DateTime.fromISO(item?.created_at).toLocaleString(
                            DateTime.DATETIME_SHORT
                          )}
                        </td>

                        <td className="whitespace-nowrap px-12 py-4 text-sm min-w-[250px]  text-gray-500">
                          <button
                            onClick={() => {
                              setDataAffiliates(item);
                              setIsOpenAffiliates(true);
                            }}
                            className="flex items-center w-24 gap-1 px-6 py-2 text-sm font-medium text-white bg-green-600 border border-gray-300 border-solid rounded-2xl shadow-sm disabled:bg-opacity-60 disabled:cursor-not-allowed hover:bg-green-700 focus:outline-none ">
                            <ViewIcon width={12} height={12} /> Xem
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-4  min-w-[150px] py-4 text-sm text-gray-500">
                          {formatCurrencyVND(item?.amount)}
                        </td>
                        <td
                          className={classNames(
                            index === 0 ? '' : 'border-t border-gray-200',
                            ' flex flex-row gap-2 items-center py-4 min-w-[150px]  '
                          )}>
                          {handleViewStatus(item)}
                          {item?.status == IWithdrawalStatus.PROCESSING ? (
                            <Button
                              onClick={() => {
                                setIsOpenAccept(true);
                                setDataAffiliates(item);
                              }}
                              className="whitespace-nowrap px-3 py-2 w-28 mt-2	 rounded-lg text-sm "
                              label="Xác nhận"></Button>
                          ) : (
                            <div className="whitespace-nowrap px-3 py-2 w-28	 rounded-lg text-sm " />
                          )}
                        </td>
                        <td className="whitespace-nowrap min-w-[250px]  px-10 py-4 text-sm text-gray-500">
                          {DateTime.fromISO(item?.updated_at).toLocaleString(
                            DateTime.DATETIME_SHORT
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap"
                        align="center"
                        colSpan={7}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {state.data?.total < DEFAULT_LIMIT ? null : (
            <Pagination
              limit={DEFAULT_LIMIT}
              total={state.data?.total}
              page={page}
              onCallBack={handleChangePage}
            />
          )}
          <ModalAffiliate
            isOpen={isOpenAffiliates}
            onClose={() => {
              setIsOpenAffiliates(false);
            }}
            obj={dataAffilates}
          />
          <ModalAcceptPayment
            isOpen={isOpenAccept}
            onClose={() => {
              setIsOpenAccept(false);
            }}
            onAcpect={onChangeStatus}
          />
        </div>
      </div>
    </>
  );
};
