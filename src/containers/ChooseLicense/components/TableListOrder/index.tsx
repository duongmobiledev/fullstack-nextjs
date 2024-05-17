import { ES } from 'aws-sdk';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EStatus } from '@common/enum';
import { formatCurrencyVND } from '@common/functions';

import Dialog from '@components/DialogNoButton';
import Pagination from '@components/Pagination';

import { DEFAULT_LIMIT } from '@constants/app';
import { statusOrders } from '@constants/status';

import Button from '@designs/Button';

import { resetAction } from '@redux/actions/common';
import {
  cancelPaymentRequest,
  getMyInvoiceByService,
} from '@redux/actions/license';

import {
  IRootState,
  IGetMyInvoiceByService,
  ICancelPaymentRequest,
  IInvoice,
} from '@typings';

import ModalPayment from '../ModalRePayment';

interface ITableListOrder {}

const TableListOrder: React.FC<ITableListOrder> = (props) => {
  const dispatch = useDispatch();
  const { invoice } = useSelector((state: IRootState) => state.license);
  const [page, setPage] = useState<number>(1);
  const { idDetailService } = useRouter().query;
  const [invoiceUpdate, setInvoiceUpdate] = useState<IInvoice | null>(null);
  const [invoiceChange, setInvoiceChange] = useState<IInvoice | null>(null);
  const { actionSuccess } = useSelector((state: IRootState) => state.common);

  useEffect(() => {
    if (actionSuccess) {
      dispatch(resetAction());
      getListInvoiceByServiceAPI(0);
      setInvoiceChange(null);
      setInvoiceUpdate(null);
      setPage(1);
    }
  }, [actionSuccess]);

  useEffect(() => {
    if (idDetailService as string) {
      getListInvoiceByServiceAPI(0);
    }
  }, [idDetailService as string]);

  const getListInvoiceByServiceAPI = (curPage: number) => {
    const params: IGetMyInvoiceByService = {
      limit: DEFAULT_LIMIT,
      offset: curPage * DEFAULT_LIMIT,
      serviceId: idDetailService as string,
    };
    dispatch(getMyInvoiceByService(params));
  };
  const handleChagePage = (newPage: number) => {
    setPage(newPage);
    getListInvoiceByServiceAPI(newPage - 1);
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
  const handleChangeStatus = (item: IInvoice) => () => {
    setInvoiceChange(item);
  };
  const handleConfirmChange = () => {
    dispatch(cancelPaymentRequest({ orderId: invoiceChange?.orderId }));
  };

  return (
    <>
      <div className="mt-6">
        <h6 className="text-lg font-semibold">Danh sách đơn hàng</h6>
        <div className="flex flex-col mt-2">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 w-[70px] min-w-[70px]  pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 min-w-[150px] text-left text-sm font-semibold text-gray-900">
                        Mã đơn
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 min-w-[150px] text-center text-sm font-semibold text-gray-900">
                        Ngày đăng ký
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center min-w-[150px]  text-sm font-semibold text-gray-900">
                        Gói cước
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 min-w-[120px] text-right text-sm font-semibold text-gray-900">
                        Tổng tiền
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 min-w-[50px] text-center text-sm font-semibold text-gray-900">
                        Trạng thái
                      </th>
                      {invoice?.items?.find(
                        (invoice) =>
                          (invoice?.status as EStatus) === EStatus.PENDING
                      ) ? (
                        <th
                          scope="col"
                          className="px-3 py-3.5 min-w-[100px] text-right text-sm font-semibold text-gray-900">
                          Hành động
                        </th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice?.items?.length > 0 ? (
                      invoice?.items?.map((item, index) => (
                        <tr key={item?._id}>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:pl-6">
                            {DEFAULT_LIMIT * (page - 1) + (index + 1)}
                          </td>

                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {item?.orderId}
                          </td>
                          <td className="px-3 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                            {DateTime.fromISO(item?.created_at).toFormat(
                              'HH:mm dd/MM/yyyy'
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {item?.package?.name}/
                            {item?.numberOfMonthsUpgrade ||
                              item?.numberOfMonths}{' '}
                            Tháng {item?.isSupport1v1 ? '| Support 1v1' : ''}{' '}
                            {item.hasOwnProperty('couponCode')
                              ? '| Coupon'
                              : ''}
                            {item.hasOwnProperty('userRefCode') ? '| Code' : ''}
                          </td>
                          <td className="px-3 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                            {formatCurrencyVND(item?.amount)}
                          </td>
                          <td className="px-3 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-full  px-2.5 py-0.5 text-sm font-medium ${
                                renderStatus(item?.status as EStatus)?.bg
                              } ${
                                renderStatus(item?.status as EStatus)?.color
                              }`}>
                              {
                                renderStatus(item?.status as EStatus)?.status
                                  ?.name
                              }
                            </span>
                          </td>
                          {invoice?.items?.find(
                            (invoice) =>
                              (invoice?.status as EStatus) === EStatus.PENDING
                          ) ? (
                            <td className="px-3 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                              {(item?.status as EStatus) ===
                                EStatus.PENDING && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setInvoiceUpdate(item)}
                                    className="w-full px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow-sm disabled:bg-opacity-60 disabled:cursor-not-allowed hover:bg-blue-800 focus:outline-none">
                                    Thanh toán
                                  </button>
                                  <button
                                    onClick={handleChangeStatus(item)}
                                    className="w-full px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-md shadow-sm disabled:bg-opacity-60 disabled:cursor-not-allowed hover:bg-red-800 focus:outline-none">
                                    Hủy
                                  </button>
                                </div>
                              )}
                            </td>
                          ) : null}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-4 pl-4 pr-3 italic text-center">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {invoice?.total > DEFAULT_LIMIT && (
                  <Pagination
                    limit={DEFAULT_LIMIT}
                    onCallBack={handleChagePage}
                    total={invoice?.total}
                    page={page}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalPayment
        orderID={invoiceUpdate?.orderId}
        onClose={() => setInvoiceUpdate(null)}
        invoice={invoiceUpdate || null}
      />
      <Dialog
        title="Hủy đơn hàng"
        open={Boolean(invoiceChange)}
        onClose={() => setInvoiceChange(null)}>
        <p>Bạn có chắc muốn hủy đơn hàng này không ?</p>
        <div className="flex justify-between mt-4">
          <Button
            variant="secondary"
            onClick={() => setInvoiceChange(null)}
            label="Đóng"
          />
          <Button
            variant="primary"
            onClick={handleConfirmChange}
            label="Xác nhận"
          />
        </div>
      </Dialog>
    </>
  );
};

export default TableListOrder;
