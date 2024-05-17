import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { formatCurrencyVND } from '@common/functions';

import Button from '@designs/Button';
import Link from '@designs/Link';

import {
  getInvoiceDetail,
  getLicenseDetailResult,
} from '@redux/actions/onepay';

import { PATH } from '@routes';

import { IRootState } from '@typings';

interface IOnePayResultProps {}
const OnePayResult: React.FC<IOnePayResultProps> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const state = useSelector((state: IRootState) => state.onePay);
  const timeStamp = DateTime.fromSeconds(state.data?.expirationTimestamp ?? 0);
  const {
    query: { licenseId, orderId },
  } = router;
  useEffect(() => {
    if (licenseId != null && licenseId != 'null') {
      dispatch(getLicenseDetailResult({ id: licenseId as string }));
    }
  }, [licenseId]);
  useEffect(() => {
    if (orderId != null && orderId != 'null') {
      dispatch(getInvoiceDetail({ orderId: orderId as string }));
    }
  }, [orderId]);
  useEffect(() => {
    if (orderId != null && orderId != 'null') {
      dispatch(getInvoiceDetail({ orderId: orderId as string }));
    }
  }, [orderId]);
  return (
    <>
      <div className="bg-zinc-100 h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-24 lg:px-8">
          <div className="h-auto w-auto p-8 bg-white rounded-md	">
            {state.data != null ? (
              <div className="max-w-xl">
                <dt className="font-base mt-1 text-lg ">
                  {state.data?.status != 'failure'
                    ? state.data?.invoice?.message
                    : state.data?.message}
                </dt>
              </div>
            ) : (
              <div />
            )}
            {state.data != null && state.data?.invoice?.status != 'success' ? (
              <div className=" display: flex max-w-full items-center justify-end mt-5 border-t border-gray-200	">
                <Link
                  routeName={PATH.SERVICES_DETAIL}
                  params={{ id: state.data?.service?._id }}>
                  <Button label=" Thử Lại"></Button>
                </Link>
              </div>
            ) : (
              <div />
            )}
            {state.data != null && state.data?.invoice?.status == 'success' ? (
              <div className="mt-5">
                <div className=" border-t border-gray-200">
                  <dt className="font-base text-lg text-blue-600">
                    Thông Tin Tài Khoản
                  </dt>
                  <dl className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-2">
                    <dt className="text-sm font-medium text-gray-500 ">
                      Id tài khoản:
                    </dt>
                    <dt className=" text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
                      {state.data?.user?._id}
                    </dt>
                  </dl>
                  <dl className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-2">
                    <dt className="text-sm font-medium text-gray-500 ">
                      Email:
                    </dt>
                    <dt className="text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
                      {state.data?.user?.email}
                    </dt>
                  </dl>
                  <dt className="font-base mt-1 text-lg text-blue-600">
                    Thông Tin Đơn Hàng
                  </dt>
                  <dl className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Mã đơn hàng:
                    </dt>
                    <dt className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {state.data?._id}
                    </dt>
                  </dl>
                  <dl className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Tổng tiền:
                    </dt>
                    <dt className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatCurrencyVND(state.data?.invoice?.amount)}
                    </dt>
                  </dl>
                  <dl className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-2">
                    <dt className="text-sm font-medium text-gray-500 ">
                      Tên sản phẩm:
                    </dt>
                    <dt className="text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
                      {state.data?.service?.name}
                    </dt>
                  </dl>
                  <dl className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-2">
                    <dt className="text-sm font-medium text-gray-500 ">
                      Thông tin:
                    </dt>
                    <dt className="text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
                      {state.data?.service?.description}
                    </dt>
                  </dl>
                  <dl className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-2">
                    <dt className="text-sm font-medium text-gray-500 ">
                      Tên gói:
                    </dt>
                    <dt className="text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
                      {state.data?.invoice?.package?.name}
                    </dt>
                  </dl>
                  <dl className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Thời gian hết hạn:
                    </dt>
                    <dt className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {timeStamp.toLocaleString(DateTime.DATETIME_SHORT)}
                    </dt>
                  </dl>
                </div>

                <div className=" display: flex max-w-full items-center justify-end mt-15">
                  <Link routeName={PATH.SERVICES}>
                    <Button label="Trang Chủ"></Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OnePayResult;
