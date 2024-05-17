import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { formatCurrencyVND } from '@common/functions';

import Pagination from '@components/Pagination';

import { getInvoicesRecieveCommission } from '@redux/actions/affiliate';

import { PATH } from '@routes';

import { IGetListAPIPagination, IRootState } from '@typings';

interface IPresentee {}
const SIZE_PER_PAGE = 10;
const Presentee: React.FC<IPresentee> = (props) => {
  const { invoiceReceiveCommission } = useSelector(
    (state: IRootState) => state.affilidate
  );
  const [currentIndexWithdraw, setCurrentIndexWithdraw] = useState<number>(1);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    query: { pageWithDraw },
  } = router;

  useEffect(() => {
    if (pageWithDraw != undefined) {
      if (Number(pageWithDraw as string) != currentIndexWithdraw) {
        setCurrentIndexWithdraw(Number(pageWithDraw as string));
      }
    }
  }, []);
  useEffect(() => {
    getListInvoiceReceiceCommissionAPI(0);
  }, []);
  const getListInvoiceReceiceCommissionAPI = (page: number) => {
    const payload: IGetListAPIPagination = {
      limit: SIZE_PER_PAGE,
      offset: page * SIZE_PER_PAGE,
    };
    dispatch(getInvoicesRecieveCommission(payload));
  };
  const onReloadPage = (index: number) => {
    getListInvoiceReceiceCommissionAPI(index);
    setCurrentIndexWithdraw(index);
    router.push({
      pathname: PATH.AFFILIATES.OVERVIEW,
      query: { pageWithDraw: index },
    });
  };
  return (
    <div className="mt-8 ">
      <h5 className="font-bold text-md lg:text-xl">
        Danh sách giao dịch được tính hoa hồng
      </h5>
      <div className="flex flex-col mt-2">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 w-[100px] min-w-[100px]  pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                      STT
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 min-w-[150px] text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 min-w-[150px] text-left text-sm font-semibold text-gray-900">
                      Mã giao dịch
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center min-w-[150px]  text-sm font-semibold text-gray-900">
                      Thời gian
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 min-w-[150px] text-right text-sm font-semibold text-gray-900">
                      Số tiền
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 min-w-[50px] text-center text-sm font-semibold text-gray-900">
                      %
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 min-w-[100px] text-right text-sm font-semibold text-gray-900">
                      Hoa hồng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceReceiveCommission?.items?.length > 0 ? (
                    invoiceReceiveCommission?.items?.map((item, index) => (
                      <tr key={item?._id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:pl-6">
                          {index + 1}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {item?.user?.email}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {item?.orderId}
                        </td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                          {DateTime.fromISO(item?.created_at).toFormat(
                            'HH:mm dd/MM/yyyy'
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                          {formatCurrencyVND(item?.amount)}
                        </td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                          {item?.discount * 100}%
                        </td>
                        <td className="px-3 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                          {formatCurrencyVND(item?.amount * item?.discount)}
                        </td>
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
              {invoiceReceiveCommission?.items?.length > SIZE_PER_PAGE && (
                <Pagination
                  limit={SIZE_PER_PAGE}
                  onCallBack={(index) => onReloadPage(index)}
                  total={invoiceReceiveCommission?.total}
                  page={currentIndexWithdraw}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentee;
