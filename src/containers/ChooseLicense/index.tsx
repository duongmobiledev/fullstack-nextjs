import { link } from 'fs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { formatCurrencyVND } from '@common/functions';

import Dialog from '@components/Dialog';

import Button from '@designs/Button';
import CheckboxCpn from '@designs/Checkbox';

import { getPackagePage, payment } from '@redux/actions/license';
import { loadDataDetailServices } from '@redux/actions/services';

import { IPackage, IRootState } from '@typings';

import AlertDialog from './components/AlertDialog';
import ModalConfirm from './components/ModalConfirm';
import PackageFeatures from './components/PackageFeatures';
import RowSelectUpgrade from './components/RowSelectUpgrade';
import TableListOrder from './components/TableListOrder';

interface IHomeProps {}

const ChooseLicense: React.FC<IHomeProps> = (props) => {
  const dispatch = useDispatch();
  const { idDetailService } = useRouter().query;
  const [packageRegister, setPackageRegister] = useState<IPackage | null>(null);
  const [packageSupport, setPackageSupport] = useState<IPackage | null>(null);
  const { packagePages, paymentRes } = useSelector(
    (state: IRootState) => state.license
  );
  const [titleAlert, setTitleAlert] = useState('');
  const { dataServiceDetail } = useSelector(
    (state: IRootState) => state.services
  );
  const route = useRouter();
  const timeNow = Date.now().valueOf() / 1000;

  useEffect(() => {
    if (paymentRes?.link) {
      route.replace(paymentRes?.link);
    }
  }, [paymentRes]);

  useEffect(() => {
    if (idDetailService as string) {
      dispatch(getPackagePage({ serviceId: idDetailService as string }));
      dispatch(loadDataDetailServices({ id: idDetailService as string }));
    }
  }, [idDetailService]);

  const checkIsUpgrade = () => {
    if (
      dataServiceDetail?.license !== null &&
      dataServiceDetail?.license?.package &&
      dataServiceDetail?.license?.expirationTimestamp > timeNow &&
      dataServiceDetail?.license?.['numberOfMonths']
    ) {
      return true;
    }
    return false;
  };

  const handleRegister = (license: IPackage) => {
    const levelPackage = dataServiceDetail?.license?.package?.level;

    if (dataServiceDetail?.license?.package !== null) {
      if (levelPackage < license?.level) {
        setTitleAlert('Chuyển đến Upgrade để hoàn thành thao tác này !');
        return;
      } else if (levelPackage > license?.level) {
        setTitleAlert(
          'Gói bản quyền hiện tại của bạn không phù hợp thao tác này !'
        );
        return;
      }
    }
    setPackageRegister(license);
  };
  const handleCheck = (license: IPackage) => {
    license?._id === packageSupport?._id
      ? setPackageSupport(null)
      : setPackageSupport(license);
  };

  return (
    <>
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col mt-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-visible shadow sm:overflow-hidden ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5  pl-4 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-6">
                        Packages
                      </th>

                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-gray-500">
                        Support 1-1
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-500">
                        Price/Tháng
                      </th>

                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {packagePages?.packages?.map((license, personIdx) => (
                      <tr key={license?._id}>
                        <td className="p-4 text-lg font-semibold text-black sm:pl-6 whitespace-nowrap">
                          {license?.name}
                        </td>

                        <td className="px-3 py-4 text-lg text-center text-black whitespace-nowrap">
                          <div className="flex items-center justify-center h-full p-1">
                            <CheckboxCpn
                              label=""
                              initChecked={packageSupport?._id === license?._id}
                              onChecked={() => handleCheck(license)}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-black whitespace-nowrap">
                          {formatCurrencyVND(license?.price)}
                        </td>
                        <td className="relative w-12 py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                          <Button
                            onClick={() => handleRegister(license)}
                            label="Đăng ký"
                            variant="primary"
                          />
                        </td>
                      </tr>
                    ))}
                    {checkIsUpgrade() && (
                      <RowSelectUpgrade
                        onClickUnAllow={() =>
                          setTitleAlert(
                            'Gói bản quyền hiện tại của bạn không phù hợp thao tác này'
                          )
                        }
                      />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <TableListOrder />
        <PackageFeatures />
      </div>
      <ModalConfirm
        isSupport={packageSupport?._id === packageRegister?._id}
        packageRegister={packageRegister}
        onClose={() => setPackageRegister(null)}
      />
      <AlertDialog message={titleAlert} onClose={() => setTitleAlert('')} />
    </>
  );
};

export default ChooseLicense;
