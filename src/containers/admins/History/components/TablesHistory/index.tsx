import { Combobox } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { debounce } from 'lodash';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { classNames } from '@common/functions/string';

import Pagination from '@components/Pagination';

import { DEFAULT_LIMIT } from '@constants/app';

import Button from '@designs/Button';
import DatePicker from '@designs/DatePicker';
import Input from '@designs/Input';

import {
  loadDataHistoryRequest,
  loadSearchHistoryRequest,
} from '@redux/actions/admin/history';

import { IRootState } from '@typings';

export interface FormData {
  fromDate: string;
  toDate: string;
}
const requires = 'Không được bỏ trống !';
export const schemaPromotion = yup
  .object()
  .shape<{ [key in keyof FormData]: any }>({
    toDate: yup.string().when('fromDate', {
      is: (value) => value != '',
      then: yup
        .string()
        .test(
          'checkValue',
          'Vui lòng nhập lớn hơn Từ ngày',
          (value, testContext) => {
            if (testContext.parent.fromDate != null) {
              if (value == null) {
                return false;
              } else {
                if (
                  DateTime.fromISO(
                    new Date(value).toISOString()
                  ).toUnixInteger() >=
                  DateTime.fromISO(
                    new Date(testContext.parent.fromDate).toISOString()
                  ).toUnixInteger()
                ) {
                  return true;
                } else {
                  return false;
                }
              }
            } else {
              return true;
            }
          }
        ),
    }),
    fromDate: '',
  });
export const TableHistory = () => {
  const state = useSelector((state: IRootState) => state.historyAdmin);
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState(state.dataHistorySearch[0]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schemaPromotion),
  });
  const dispatch = useDispatch();
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    dispatch(
      loadDataHistoryRequest({
        email: selected,
        fromDate: fromDate,
        toDate: toDate,
        limit: DEFAULT_LIMIT,
        offset: (newPage - 1) * DEFAULT_LIMIT,
      })
    );
  };

  useEffect(() => {
    dispatch(
      loadDataHistoryRequest({
        email: '',
        fromDate: '',
        toDate: '',
        limit: DEFAULT_LIMIT,
        offset: 0,
      })
    );
  }, []);

  const onChangeInput = useCallback(
    debounce((value: string) => {
      onGetHistorySearch(value);
      if (value == '') {
        setSelected('');
        setPage(1);
        dispatch(
          loadDataHistoryRequest({
            email: '',
            fromDate: '',
            toDate: '',
            limit: DEFAULT_LIMIT,
            offset: 0,
          })
        );
      }
    }, 300),
    []
  );

  const onGetHistorySearch = (value: string) => {
    dispatch(loadSearchHistoryRequest({ email: value }));
  };

  const onSubmit = (data: FormData) => {
    setFromDate(
      data.fromDate != null
        ? DateTime.fromISO(new Date(data.fromDate).toISOString())
            .toUnixInteger()
            .toString()
        : ''
    );
    setToDate(
      data.toDate != null
        ? DateTime.fromISO(new Date(data.toDate).toISOString())
            .toUnixInteger()
            .toString()
        : ''
    );
    //
    setPage(1);
    dispatch(
      loadDataHistoryRequest({
        email: selected,
        fromDate:
          data.fromDate != null
            ? DateTime.fromISO(new Date(data.fromDate).toISOString())
                .toUnixInteger()
                .toString()
            : '',
        toDate:
          data.toDate != null
            ? (
                DateTime.fromISO(
                  new Date(data.toDate).toISOString()
                ).toUnixInteger() + 86399
              ).toString()
            : '',
        limit: DEFAULT_LIMIT,
        offset: 0,
      })
    );
  };

  return (
    <>
      <div className="flex flex-col w-full pt-3 sm:flex-row md:items-center sm:gap-2">
        <h1 className="text-sm font-semibold text-gray-900 w-40">Tìm kiếm</h1>
        <Combobox
          className={'w-full'}
          value={selected}
          onChange={(value) => {
            setSelected(value);
            setPage(1);
            dispatch(
              loadDataHistoryRequest({
                email: selected,
                fromDate: '',
                toDate: '',
                limit: DEFAULT_LIMIT,
                offset: 0,
              })
            );
          }}
          as="div">
          <div className="relative flex-col sm:flex-row">
            <span className="relative inline-flex flex-row w-full px-3 py-2 overflow-hidden border rounded-md shadow-sm">
              <Combobox.Input
                onChange={(e) => {
                  onChangeInput(e.target.value);
                }}
                className="block w-full p-0 text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0 sm:text-sm"
                placeholder="Tài khoản thực hiện"
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
                {state.dataHistorySearch?.length > 0 ? (
                  state.dataHistorySearch?.map((item, index) => (
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
                    <span className="font-normal">Không có dữ liệu</span>
                  </Combobox.Option>
                )}
              </Combobox.Options>
            </div>
          </div>
        </Combobox>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center gap-2 sm:ml-2 sm:flex-row">
            <DatePicker
              control={control as any}
              label=""
              placeholder="Từ ngày"
              name={'fromDate'}
              className="w-full text-gray-900 rounded-lg  sm:text-sm md:w-64"
              errorMessage={errors.fromDate?.message}></DatePicker>
            <DatePicker
              control={control as any}
              label=""
              placeholder="Đến ngày"
              name={'toDate'}
              className="w-full text-gray-900 rounded-lg  sm:text-sm md:w-64"
              errorMessage={errors.toDate?.message}></DatePicker>
            <Button
              type="submit"
              className="w-full sm:ml-4 md:w-24"
              label="Tìm"></Button>
          </div>
        </form>
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
                      className="py-3.5 pl-4 pr-3 min-w-[50px] text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      #
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left min-w-[250px] text-sm font-semibold text-gray-900 sm:pl-6">
                      Tài khoản thực hiện
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm min-w-[250px] font-semibold text-gray-900 sm:pl-6">
                      Thời gian thực hiện
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm  min-w-[450px]font-semibold text-gray-900 sm:pl-6">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="overflow-x-auto bg-white divide-y divide-gray-200 w-96">
                  {state.dataHistory?.items?.length > 0 ? (
                    state.dataHistory?.items?.map((e, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  min-w-[50px] font-medium text-gray-900 sm:pl-6">
                          {index + 1 + (page - 1) * 10}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm  min-w-[250px] text-gray-500">
                          {e.user?.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm  min-w-[250px] text-gray-500">
                          {DateTime.fromISO(e?.created_at).toFormat(
                            'HH:mm dd/MM/yyyy'
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4  min-w-[350px] text-sm text-gray-500">
                          {e.action}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <td
                      colSpan={4}
                      className="w-full py-4 pl-4 pr-3 text-xs italic text-center">
                      Không có dữ liệu
                    </td>
                  )}
                </tbody>
              </table>
              {state.dataHistory?.total < DEFAULT_LIMIT ? null : (
                <Pagination
                  limit={DEFAULT_LIMIT}
                  total={state.dataHistory?.total}
                  page={page}
                  onCallBack={handleChangePage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
