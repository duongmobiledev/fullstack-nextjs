import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Checkbox from '@designs/Checkbox';

import useAuth from '@hooks/useAuth';

import { IRootState, NameNotify, INotification } from '@typings';

import { ProfileContext } from '../context';

interface INotifyCheckbox {
  updates: boolean;
  invoices: boolean;
  promotions: boolean;
}
interface INotifications {}
const Notifications = () => {
  const profileCtx = useContext(ProfileContext);
  const [checkboxList, setCheckboxList] = useState<INotifyCheckbox>({
    invoices: false,
    promotions: false,
    updates: false,
  });

  const { profile } = useAuth();

  useEffect(() => {
    if (profileCtx.reset) {
      profileCtx.onReset();
      setCheckboxList({
        invoices: findValueNotify(profile?.notifications, 'invoices'),
        promotions: findValueNotify(profile?.notifications, 'promotions'),
        updates: findValueNotify(profile?.notifications, 'updates'),
      });
    }
  }, [profileCtx.reset]);

  useEffect(() => {
    if (profileCtx?.notify) {
      setCheckboxList({
        invoices: findValueNotify(profileCtx?.notify, 'invoices'),
        promotions: findValueNotify(profileCtx?.notify, 'promotions'),
        updates: findValueNotify(profileCtx?.notify, 'updates'),
      });
    }
  }, [profileCtx?.notify]);

  const findValueNotify = (
    notifications: INotification[],
    type: NameNotify
  ) => {
    return (
      notifications?.find((item) => item?.typeNotification === type)?.value ||
      false
    );
  };
  const handleCheckedUpdate = () => {
    // setCheckboxList({ ...checkboxList, updates: !checkboxList.updates });
    profileCtx.onChangeNotify({
      typeNotification: 'updates',
      value: !checkboxList.updates,
    });
  };
  const handleCheckedInvoices = () => {
    // setCheckboxList({ ...checkboxList, invoices: !checkboxList.invoices });
    profileCtx.onChangeNotify({
      typeNotification: 'invoices',
      value: !checkboxList.invoices,
    });
  };
  const handleCheckedPromotions = () => {
    // setCheckboxList({ ...checkboxList, promotions: !checkboxList.promotions });
    profileCtx.onChangeNotify({
      typeNotification: 'promotions',
      value: !checkboxList.promotions,
    });
  };

  return (
    <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Thông báo
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Quyết định thông tin liên lạc bạn muốn nhận và cách thức.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <Checkbox
            initChecked={checkboxList.updates}
            onChecked={handleCheckedUpdate}
            label="Cập nhật"
            className=""
          />

          <Checkbox
            initChecked={checkboxList.invoices}
            onChecked={handleCheckedInvoices}
            label="Hóa đơn"
            className="mt-4 space-y-4"
          />

          <Checkbox
            initChecked={checkboxList.promotions}
            onChecked={handleCheckedPromotions}
            label="Khuyến mãi"
            className="mt-4 space-y-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
