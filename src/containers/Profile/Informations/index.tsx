import { useContext, useEffect, useState } from 'react';
import {
  DeepRequired,
  FieldErrorsImpl,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { useSelector } from 'react-redux';

import { countryList } from '@constants/country';
import { genders } from '@constants/gender';

import { FormData } from '@containers/Profile';
import { ProfileContext } from '@containers/Profile/context';

import Input from '@designs/Input';
import RadioButtonGroup from '@designs/RadioButtonGroup';
import Select from '@designs/Select';

import useAuth from '@hooks/useAuth';

import { ICountry, IGender, IRootState } from '@typings';

interface IInformationProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrorsImpl<DeepRequired<FormData>>;
  setValue: UseFormSetValue<FormData>;
}

const Information: React.FC<IInformationProps> = (props) => {
  const { register, errors, setValue } = props;
  const profileCtx = useContext(ProfileContext);
  const { profile } = useAuth();
  useEffect(() => {
    if (profile?.email) {
      const {
        displayName,
        phoneNumber,
        zipCode,
        city,
        email,
        address,
        state,
        gender,
      } = profile || {};

      setValue('email', email);
      setValue('city', city);
      setValue('displayName', displayName);
      setValue('zipCode', zipCode);
      setValue('phoneNumber', phoneNumber);
      setValue('address', address);
      setValue('state', state);
      const country = countryList.filter(
        (item) => item.name === profile.country
      );
      profileCtx.onChangeCountry(country[0]);
      profileCtx.onChangeGender(genders[gender || 1]);
    }
  }, [profile]);
  const handleCountrySelected = (country: ICountry) => {
    profileCtx.onChangeCountry(country);
  };
  const handleChangeGender = (gender: IGender) => {
    profileCtx.onChangeGender(gender);
  };

  return (
    <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Thông tin cá nhân
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Sử dụng một địa chỉ thường trú để bạn có thể nhận thư.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="grid grid-cols-6 gap-6">
            <Input
              className="col-span-6 sm:col-span-3"
              name="displayName"
              label="Họ tên"
              placeholder="Nhập họ tên"
              required
              register={register}
              errorMessage={errors.displayName?.message}
            />
            <RadioButtonGroup
              required
              label="Giới tính"
              options={genders}
              optionSelected={profileCtx?.gender || genders[1]}
              optionTarget="name"
              formTarget="code"
              onSelect={handleChangeGender}
              className="col-span-6 sm:col-span-3"
            />
            <Input
              className="col-span-6 sm:col-span-3"
              name="email"
              label="Địa chỉ email"
              required
              disabled
              register={register}
            />
            <Input
              className="col-span-6 sm:col-span-3"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              name="phoneNumber"
              type="number"
              register={register}
              required
              errorMessage={errors.phoneNumber?.message}
            />

            <Select
              name="country"
              placeholder="Chọn quốc gia"
              required
              optionTarget="name"
              label="Quốc gia"
              options={countryList}
              optionSelected={profileCtx.country}
              onSelect={handleCountrySelected}
              className="col-span-6"
              errorMessage={profileCtx.error}
            />
            <Input
              className="col-span-6 "
              name="address"
              label="Địa chỉ đường"
              placeholder="Nhập địa chỉ đường"
              required
              register={register}
              errorMessage={errors.address?.message}
            />
            <Input
              className="col-span-6 sm:col-span-6 lg:col-span-2 "
              name="city"
              label="Thành phố/ Tỉnh"
              placeholder="Nhập thành phố/ tỉnh"
              required
              register={register}
              errorMessage={errors.city?.message}
            />
            <Input
              className="col-span-6 sm:col-span-3 lg:col-span-2 "
              name="state"
              label="Quận/ huyện"
              placeholder="Nhập quận/ huyện"
              required
              register={register}
              errorMessage={errors.state?.message}
            />
            <Input
              className="col-span-6 sm:col-span-3 lg:col-span-2 "
              name="zipCode"
              placeholder="Nhập zip/ Mã bưu điện"
              label="ZIP / Mã bưu điện"
              required
              type="number"
              register={register}
              errorMessage={errors.zipCode?.message}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
