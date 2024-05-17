import { useContext, useEffect, useState } from 'react';
import {
  UseFormRegister,
  UseFormSetValue,
  FieldErrorsImpl,
  DeepRequired,
  Control,
} from 'react-hook-form';

import Input from '@designs/Input';
import Select from '@designs/Select';

import { ModalPackages } from '../../ModalPackages';
import { CouponContext, ECouponType, EPromotionType } from '../../context';
import { IFormDataCoupon } from '../../schema';

interface Props {
  namePackage: string;
  nameNumberLicense: string;
  nameLimit: string;
  nameValue: string;
  nameUtil: string;
  register: UseFormRegister<IFormDataCoupon>;
  setValue: UseFormSetValue<IFormDataCoupon>;
  errors: FieldErrorsImpl<DeepRequired<IFormDataCoupon>>;
  nameTypeCoupon: string;
}
const lstType = [
  { index: 0, name: 'Giảm giá', value: ECouponType.PROMO },
  { index: 1, name: 'Bản Quyền', value: ECouponType.RENEWAL },
];
const lstUtilPromotion = [
  { index: 0, name: 'Tiền', value: EPromotionType.PRICE },
  { index: 1, name: 'Phần trăm', value: EPromotionType.PERCENT },
];
export const FormPackage = (props: Props) => {
  const {
    namePackage,
    nameNumberLicense,
    register,
    errors,
    nameLimit,
    nameUtil,
    setValue,
    nameValue,
    nameTypeCoupon,
  } = props;
  const [isSelect, setIsSelect] = useState<number>(0);
  const [isSelectUtil, setIsSelectUtil] = useState<number>(0);
  const { couponType, setCouponType } = useContext(CouponContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSelected = (options) => {
    setIsSelect(options.index);
    setCouponType(options.value);
    setValue('nameTypeCoupon', options.value);
  };
  const handleSelectedUtil = (options) => {
    setIsSelectUtil(options.index);
    setValue('unitPromotion', options.value);
  };
  useEffect(() => {
    setValue('unitPromotion', lstUtilPromotion[0].value);
    setValue('nameTypeCoupon', lstType[0].value);
  }, []);
  return (
    <div className=" grid grid-cols-8 w-full flex md:gap-8 ">
      <Select
        name={nameTypeCoupon}
        required
        optionTarget="name"
        label=""
        options={lstType}
        optionSelected={lstType[isSelect]}
        onSelect={handleSelected}
        className="col-span-8 sm:col-span-2 mt-2"
      />
      {couponType === ECouponType.RENEWAL ? (
        <>
          <button
            className="col-span-8 sm:col-span-2 mt-2"
            type="button"
            onClick={() => {
              setIsOpen(true);
            }}>
            <Input
              disabled
              name={namePackage}
              className="col-span-8 sm:col-span-2"
              register={register}
              placeholder={'Gói'}
              required
              errorMessage={errors.package?.message}
            />
          </button>
          <Input
            name={nameNumberLicense}
            className="col-span-8 sm:col-span-2 mt-2"
            register={register}
            type={'number'}
            placeholder={'Số ngày bản quyền'}
            required
            errorMessage={errors.numberLicense?.message}
          />
          <Input
            name={nameLimit}
            className="col-span-8 sm:col-span-2 mt-2"
            register={register}
            placeholder={'Giới hạn'}
            type={'number'}
            required
            errorMessage={errors.limit?.message}
          />
        </>
      ) : (
        <>
          <Select
            name={nameUtil}
            required
            optionTarget="name"
            label=""
            options={lstUtilPromotion}
            optionSelected={lstUtilPromotion[isSelectUtil]}
            onSelect={handleSelectedUtil}
            className="col-span-8 sm:col-span-2 mt-2"
            errorMessage={errors.unitPromotion?.message}
          />

          <Input
            name={nameValue}
            className="col-span-8 sm:col-span-2 mt-2"
            register={register}
            placeholder={'Giá trị'}
            type={'number'}
            required
            errorMessage={errors.valuePromotion?.message}
          />
        </>
      )}
      <ModalPackages
        isOpen={isOpen}
        onClickItem={(value, key) => {
          setValue('package', value);
        }}
        onClose={() => {
          setIsOpen(false);
        }}></ModalPackages>
    </div>
  );
};
