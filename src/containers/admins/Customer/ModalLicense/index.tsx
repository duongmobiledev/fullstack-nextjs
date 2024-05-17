import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '@components/Dialog';
import Pagination from '@components/Pagination';

import { DEFAULT_LIMIT } from '@constants/app';

import { getLicenseListByUser } from '@redux/actions/admin';

import { ICustomer, IGetLicenseListByUser, IRootState } from '@typings';

interface IModalLicense {
  open: boolean;
  onClose: () => void;
  data: ICustomer;
}

const ModalLicense: React.FC<IModalLicense> = (props) => {
  const { onClose, open, data } = props;
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch();
  const { license } = useSelector((state: IRootState) => state.customer);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    getLicenseList(newPage - 1);
  };

  useEffect(() => {
    if (open) {
      getLicenseList(0);
    }
  }, [open]);

  const getLicenseList = (page: number) => {
    const params: IGetLicenseListByUser = {
      userId: data?.user?._id,
      limit: DEFAULT_LIMIT,
      offset: page * DEFAULT_LIMIT,
    };
    dispatch(getLicenseListByUser(params));
  };
  return (
    <Dialog
      className="lg:min-w-[900px]"
      title="Thông tin bản quyền"
      open={open}
      onClose={onClose}>
      <div>
        <p className="text-left">
          <span className="font-bold text-gray-700">ID tài khoản:</span>{' '}
          <span className="ml-1">{data?.user?.accountId}</span>
        </p>
        <p className="text-left">
          <span className="font-bold text-gray-700">Email:</span>{' '}
          <span className="ml-1">{data?.user.email}</span>
        </p>
      </div>
      <div className="flex flex-col mt-4">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 min-w-[140px] text-center text-sm font-semibold text-gray-900 sm:px-6`}>
                      Sản phẩm
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 min-w-[140px] text-center text-sm font-semibold text-gray-900 sm:px-6`}>
                      Gói
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 min-w-[140px] text-center text-sm font-semibold text-gray-900 sm:px-6`}>
                      Đăng ký
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 min-w-[140px] text-center text-sm font-semibold text-gray-900 sm:px-6`}>
                      Update
                    </th>
                    <th
                      scope="col"
                      className={`py-3.5 px-4 min-w-[140px] text-center text-sm font-semibold text-gray-900 sm:px-6`}>
                      Hết hạn
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {license?.items?.length > 0 ? (
                    license?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3.5 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                          {item?.service?.name}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                          {item.invoice?.package?.name}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                          {DateTime.fromISO(
                            item.created_at?.toString()
                          ).toFormat('HH:mm dd/MM/yyyy')}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                          {DateTime.fromISO(
                            item.updated_at?.toString()
                          ).toFormat('HH:mm dd/MM/yyyy')}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:px-6">
                          {DateTime.fromSeconds(
                            item?.expirationTimestamp
                          ).toFormat('HH:mm dd/MM/yyyy')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="py-3.5 px-4 text-sm text-gray-500 whitespace-nowrap"
                        align="center"
                        colSpan={5}>
                        Không có bản quyền
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {license?.total < DEFAULT_LIMIT ? null : (
        <Pagination
          limit={DEFAULT_LIMIT}
          total={license?.total}
          page={page}
          onCallBack={handleChangePage}
        />
      )}
    </Dialog>
  );
};

export default ModalLicense;
