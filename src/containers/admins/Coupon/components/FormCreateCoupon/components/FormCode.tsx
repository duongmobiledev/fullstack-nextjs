import { useState } from 'react';
import {
  Control,
  DeepRequired,
  FieldErrorsImpl,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

import DatePicker from '@designs/DatePicker';
import Input from '@designs/Input';

import { ModalServices } from '../../ModalServices';
import { IFormDataCoupon } from '../../schema';

interface Props {
  nameCode: string;
  nameProduct: string;
  nameQuality: string;
  nameValidTill: string;
  register: UseFormRegister<IFormDataCoupon>;
  setValue: UseFormSetValue<IFormDataCoupon>;
  errors: FieldErrorsImpl<DeepRequired<IFormDataCoupon>>;
  control: Control<IFormDataCoupon>;
}

export const FormCode = (props: Props) => {
  const {
    nameCode,
    nameProduct,
    nameQuality,
    register,
    errors,
    nameValidTill,
    setValue,
    control,
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClickProductServices = (value: string[]) => {
    setValue('production', value);
  };
  return (
    <div className=" grid grid-cols-8 w-full  md:gap-8">
      <Input
        name={nameCode}
        className="col-span-8 mt-2 sm:col-span-2"
        register={register}
        placeholder={'Tạo code'}
        required
        errorMessage={errors.code?.message}
      />
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
        className="col-span-8 mt-2 sm:col-span-2">
        <Input
          disabled
          name={nameProduct}
          className="col-span-8 sm:col-span-2"
          register={register}
          placeholder="Chọn sản phầm"
          required
          errorMessage={errors.production?.message}
        />
      </button>

      <Input
        name={nameQuality}
        className="col-span-8 mt-2 sm:col-span-2"
        register={register}
        type={'number'}
        placeholder={'Số lượng'}
        required
        errorMessage={errors.quality?.message}
      />
      <DatePicker
        control={control as any}
        label=""
        placeholder="Hiệu lực đến"
        name={nameValidTill}
        className="col-span-8 mt-2 sm:col-span-2"
        errorMessage={errors.validTill?.message}
      />

      <ModalServices
        onClickItem={onClickProductServices}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};
