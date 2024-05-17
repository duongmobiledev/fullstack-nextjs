import { list } from 'postcss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  calcPackage,
  calcUpgradePackage,
  formatCurrencyVND,
} from '@common/functions';

import { months } from '@constants/month';

import Button from '@designs/Button';
import Select from '@designs/Select';

import { setNotify } from '@redux/actions/common';

import {
  IPackage,
  ILicense,
  IRootState,
  IMonthPackage,
  IPackagePage,
} from '@typings';

import ModalUpdate from '../ModalUpdate';

interface ISelectMonthsProps {
  onClickUnAllow?: () => void;
}
interface IMonth {
  value: number;
  name: string;
}

const SelectMonths: React.FC<ISelectMonthsProps> = (props) => {
  const { onClickUnAllow } = props;
  const { packagePages } = useSelector((state: IRootState) => state.license);
  const { dataServiceDetail } = useSelector(
    (state: IRootState) => state.services
  );
  const dispatch = useDispatch();
  const [listMonth, setListMonth] = useState<IMonthPackage[]>([]);
  const [monthDefault, setMonthDefault] = useState<IMonthPackage | null>();

  const [monthToSelected, setMonthToSelected] = useState<IMonthPackage | null>(
    null
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (packagePages?.packages.length > 0 && dataServiceDetail !== null) {
      const monthPackages = getListMonthPackages(dataServiceDetail?.license);
      setListMonth(monthPackages);
      if (dataServiceDetail?.license?.package === null) return;
      const monthString = dataServiceDetail?.license?.numberOfMonths
        ? ` / ${dataServiceDetail?.license?.numberOfMonths} Tháng`
        : '';

      const userLicense: IMonthPackage = {
        text: `${dataServiceDetail?.license?.package?.name}${monthString}`,
      };
      setMonthDefault(userLicense);
    }
  }, [dataServiceDetail, packagePages]);

  const getPackagesWithLevelBigger = (packageItem: IPackage) => {
    return packagePages?.packages?.filter(
      (item) => item?.level > packageItem?.level
    );
  };
  const getListMonthPackages = (license: ILicense) => {
    if (license?.package === null) return [];
    const updatePackageList = getPackagesWithLevelBigger(license?.package);

    //Gói hiện tại là lớn nhất
    if (updatePackageList?.length === 0) return [];

    //Gói có level lớn hơn gói hiện tại
    const monthUpgrade = months.filter(
      (item) => item?.month >= license.numberOfMonths
    );
    const listMonth: IMonthPackage[] = [];
    monthUpgrade?.map((mth) =>
      updatePackageList?.map((item) => {
        const monthPackage: IMonthPackage = {
          level: item.level,
          name: item.name,
          text: item.name + ' / ' + mth?.text,
          month: mth?.month,
          id_package: item._id,
          price: item?.price,
        };
        listMonth.push(monthPackage);
      })
    );
    return listMonth;
  };

  const handleSelect = (monthPackage: IMonthPackage) => {
    setMonthToSelected(monthPackage);
  };

  const handleRegister = () => {
    const curPackage = dataServiceDetail?.license?.package; //0
    const updatePackageList = getPackagesWithLevelBigger(curPackage);
    if (updatePackageList?.length === 0) {
      onClickUnAllow && onClickUnAllow();
      return;
    }
    if (monthToSelected === null || listMonth?.length === 0) {
      dispatch(
        setNotify({
          type: 'warn',
          message: 'Vui lòng chọn gói bạn muốn nâng cấp',
          title: 'Thông báo',
        })
      );
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    setMonthToSelected(null);
    setOpen(false);
  };
  const renderPriceUpgrade = () => {
    const oldPrice = calcPackage(
      dataServiceDetail?.license?.numberOfMonths,
      dataServiceDetail?.license?.package?.price
    );

    if (monthToSelected === null) {
      return formatCurrencyVND(oldPrice || 0);
    }
    const total = calcUpgradePackage(
      oldPrice,
      monthToSelected?.month,
      monthToSelected?.price
    );
    return formatCurrencyVND(total || 0);
  };
  return (
    <>
      <tr>
        <td className="p-4 text-lg font-semibold text-black sm:pl-6 whitespace-nowrap">
          Upgrade
        </td>

        <td className="px-3 py-4 text-sm text-black whitespace-nowrap">
          <div className="flex justify-center w-full min-w-full gap-3">
            <div className="flex items-center gap-2">
              <p>từ</p>
              <Select
                className="min-w-[200px]"
                options={[monthDefault]}
                optionTarget="text"
                label=""
                direction="top"
                onSelect={() => {}}
                disabled
                optionSelected={monthDefault}
                placeholder=""
              />
            </div>
            <div className="flex items-center gap-2">
              <p>lên</p>
              <Select
                className="min-w-[200px]"
                options={listMonth}
                optionTarget="text"
                label=""
                direction="top"
                onSelect={handleSelect}
                optionSelected={monthToSelected}
                placeholder="Chọn gói"
                disabled={listMonth?.length === 0}
              />
            </div>
          </div>
        </td>
        <td className="px-3 py-4 text-sm text-black whitespace-nowrap">
          {renderPriceUpgrade()}
        </td>
        <td className="relative w-12 py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
          <Button onClick={handleRegister} label="Đăng ký" variant="primary" />
        </td>
      </tr>
      <ModalUpdate
        open={open}
        packageRegister={monthToSelected}
        onClose={handleClose}
      />
    </>
  );
};

export default SelectMonths;
