import { yupResolver } from '@hookform/resolvers/yup';
import { DateTime } from 'luxon';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ICouponRenewalRequest, IValues } from 'src/typings/Admin/Coupon';

import { DEFAULT_LIMIT } from '@constants/app';

import {
  IFormDataCoupon,
  schema,
} from '@containers/admins/Coupon/components/schema';

import Button from '@designs/Button';

import {
  createCouponAdminRequest,
  loadCouponAdminListRequest,
} from '@redux/actions/admin';

import { IRootState } from '@typings';

import { CouponContext, ECouponType } from '../context';
import { FormCode } from './components/FormCode';
import { FormPackage } from './components/FormPackage';

export const FormCreateCoupon = () => {
  const { couponType } = useContext(CouponContext);
  const dispatch = useDispatch();
  const state = useSelector((state: IRootState) => state.couponAdmin);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFormDataCoupon>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormDataCoupon) => {
    let valuesRenewal: IValues = {
      extraTimestamp: Number(data.numberLicense) * 24 * 60 * 60,
      package: data.package,
      dailyLimit: Number(data.limit),
    };
    let valuesPromotion: IValues = {
      discountBy: data.unitPromotion,
      percent: Number(data.valuePromotion),
      price: Number(data.valuePromotion),
    };
    let dataRequest: ICouponRenewalRequest = {
      code: data.code,
      type: couponType,
      limit: Number(data.quality),
      validUntil: DateTime.fromISO(
        new Date(data.validTill).toISOString()
      ).toUnixInteger(),
      services: data.production,
      value: couponType === ECouponType.PROMO ? valuesPromotion : valuesRenewal,
    };
    dispatch(createCouponAdminRequest(dataRequest));
  };
  useEffect(() => {
    if (state.actionSuccess) {
      dispatch(
        loadCouponAdminListRequest({
          couponCode: '',
          limit: DEFAULT_LIMIT,
          offset: 0,
        })
      );
    }
  }, [state.actionSuccess]);

  return (
    <div className="flex flex-col w-full gap-2 sm:flex-row md:items-start">
      <div className="w-40">
        <h1 className="text-sm font-semibold text-gray-900">Tạo Coupon</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-full">
        <FormCode
          control={control}
          errors={errors}
          nameCode={'code'}
          nameProduct={'production'}
          nameQuality={'quality'}
          nameValidTill={'validTill'}
          register={register}
          setValue={setValue}
        />
        <FormPackage
          nameTypeCoupon="nameTypeCoupon"
          errors={errors}
          register={register}
          nameLimit={'limit'}
          nameNumberLicense={'numberLicense'}
          namePackage={'package'}
          nameUtil={'unitPromotion'}
          nameValue={'valuePromotion'}
          setValue={setValue}
        />
        <Button
          type="submit"
          label="Tạo"
          className="mt-4 sm:w-full md:w-96"></Button>
      </form>
    </div>
  );
};
