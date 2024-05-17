import { Combobox } from '@headlessui/react';
import { ViewIcon } from '@icons';
import { debounce } from 'lodash';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICouponList } from 'src/typings/Admin/Coupon';

import { classNames } from '@common/functions/string';

import Pagination from '@components/Pagination';

import { DEFAULT_LIMIT } from '@constants/app';

import {
  loadCouponAdminListRequest,
  loadCouponAdminSearchRequest,
} from '@redux/actions/admin';

import { IRootState } from '@typings';

import { ModalCouponPromotion } from '../ModalPromotion';
import { ModalCouponRenewal } from '../ModalRenewal';
import { ECouponType } from '../context';

export const TableCoupon = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenPromotion, setIsOpenPromotion] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch();
  const state = useSelector((state: IRootState) => state.couponAdmin);
  const [obj, setObj] = useState<ICouponList>();
  const [selected, setSelected] = useState(state.dataCouponSearch[0]);

  useEffect(() => {
    dispatch(
      loadCouponAdminListRequest({
        couponCode: '',
        limit: DEFAULT_LIMIT,
        offset: 0,
      })
    );
    setSelected('');
  }, []);

  const onChangeInput = useCallback(
    debounce((value: string) => {
      onGetCouponSearch(value);
      if (value == '') {
        setSelected('');
        dispatch(
          loadCouponAdminListRequest({
            couponCode: '',
            limit: DEFAULT_LIMIT,
            offset: 0,
          })
        );
      }
    }, 300),
    []
  );

  const onGetCouponSearch = (value: string) => {
    dispatch(loadCouponAdminSearchRequest({ couponCode: value }));
  };
  const onSelectCoupon = (value: string) => {
    dispatch(
      loadCouponAdminListRequest({
        couponCode: value,
        limit: DEFAULT_LIMIT,
        offset: 0,
      })
    );
  };
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    dispatch(
      loadCouponAdminListRequest({
        couponCode: selected,
        limit: DEFAULT_LIMIT,
        offset: (newPage - 1) * DEFAULT_LIMIT,
      })
    );
  };

  return (
    <>
      <div className="flex flex-col w-full gap-2 pt-5 sm:flex-row md:items-center">
        <h1 className="w-40 text-sm font-semibold text-gray-900">
          Tìm theo mã Coupon
        </h1>
        <Combobox
          className={'w-full'}
          value={selected}
          onChange={(value) => {
            setSelected(value);
            onSelectCoupon(value);
          }}
          as="div">
          <div className="relative w-full">
            <span className="relative inline-flex flex-row w-full px-3 py-2 overflow-hidden border rounded-md shadow-sm">
              <Combobox.Input
                onChange={(e) => {
                  onChangeInput(e.target.value);
                }}
                className="block w-full p-0 text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0 sm:text-sm"
                placeholder="Nhập mã code"
                onFocus={(event) => {
                  requestAnimationFrame(() => {
                    event.target.setSelectionRange(
                      0,
                      event.target.value.length
                    );
                  });
                }}
              />
            </span>
            <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg">
              <Combobox.Options className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5">
                {state.dataCouponSearch?.length > 0 ? (
                  state.dataCouponSearch?.map((item, index) => (
                    <Combobox.Option
                      key={index}
                      value={item}
                      className={({ active }) => {
                        return classNames(
                          'relative cursor-default select-none py-2 pl-3 pr-9 focus:outline-none',
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                        );
                      }}>
                      {({ active, selected }) => (
                        <>
                          <span
                            className={classNames(
                              'block truncate',
                              'font-normal'
                            )}>
                            {item}
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                  ))
                ) : (
                  <Combobox.Option
                    className="relative py-2 pl-3 text-left text-gray-400 cursor-default select-none pr-9"
                    value={''}>
                    <span className="font-normal">Không tìm thấy dữ liệu</span>
                  </Combobox.Option>
                )}
              </Combobox.Options>
            </div>
          </div>
        </Combobox>
      </div>
      <div className="flex flex-col mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[50px] text-gray-900 sm:pl-6">
                      #
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[150px] text-gray-900 sm:pl-6">
                      Mã Coupon
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[250px] text-gray-900 sm:pl-6">
                      Thời gian tạo
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[250px] text-gray-900 sm:pl-6">
                      Loại
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[150px] text-gray-900 sm:pl-6">
                      Số lượng
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[250px] text-gray-900 sm:pl-6">
                      Hiệu lực đến
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[250px] text-gray-900 sm:pl-6">
                      Đã sử dụng
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  min-w-[250px] text-gray-900 sm:pl-6">
                      Nội dung
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 ">
                  {state.dataCouponList?.items?.length > 0 ? (
                    state.dataCouponList?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-4 pl-4  min-w-[50px] pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                          {index + 1 + (page - 1) * 10}
                        </td>
                        <td className="px-3 py-4 text-sm  min-w-[150px] text-gray-500 whitespace-nowrap">
                          {item?.code}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500  min-w-[250px] whitespace-nowrap">
                          {DateTime.fromISO(item?.created_at).toLocaleString(
                            DateTime.DATETIME_SHORT
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500  min-w-[250px] whitespace-nowrap">
                          {item?.type === ECouponType.RENEWAL
                            ? 'Bản quyền'
                            : 'Giảm giá'}
                        </td>
                        <td className="px-10 py-4 text-sm text-gray-500   min-w-[150px] whitespace-nowrap">
                          {item?.limit}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500  min-w-[250px] whitespace-nowrap">
                          {DateTime.fromSeconds(
                            item?.validUntil
                          ).toLocaleString(DateTime.DATETIME_SHORT)}
                        </td>
                        <td className="px-10 py-4 text-sm text-gray-500  min-w-[150px] whitespace-nowrap">
                          {item?.used}
                        </td>
                        <button
                          onClick={() => {
                            setObj(item);
                            item?.type === ECouponType.RENEWAL
                              ? setIsOpen(true)
                              : setIsOpenPromotion(true);
                          }}
                          className="flex items-center w-24 gap-1 px-6 py-2 mt-1 text-sm font-medium text-white bg-green-600 border border-gray-300 border-solid rounded-2xl shadow-sm disabled:bg-opacity-60 disabled:cursor-not-allowed hover:bg-green-700 focus:outline-none ">
                          <ViewIcon width={20} height={20} /> Xem
                        </button>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap"
                        align="center"
                        colSpan={8}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {state.dataCouponList?.total < DEFAULT_LIMIT ? null : (
          <Pagination
            limit={DEFAULT_LIMIT}
            total={state.dataCouponList?.total}
            page={page}
            onCallBack={handleChangePage}
          />
        )}
        <ModalCouponRenewal
          obj={obj}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        />
        <ModalCouponPromotion
          isOpen={isOpenPromotion}
          obj={obj}
          onClose={() => {
            setIsOpenPromotion(false);
          }}
        />
      </div>
    </>
  );
};
